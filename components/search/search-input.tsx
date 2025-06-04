"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const lastSearchedQuery = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldMaintainFocus = useRef(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && query !== lastSearchedQuery.current) {
        shouldMaintainFocus.current = true;
        lastSearchedQuery.current = query;
        onSearch(query);
      }
    },
    [query, onSearch]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      shouldMaintainFocus.current = true;
    },
    []
  );

  // Handle debounced search
  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery !== lastSearchedQuery.current) {
      shouldMaintainFocus.current = true;
      lastSearchedQuery.current = debouncedQuery;
      onSearch(debouncedQuery);
    } else if (!debouncedQuery.trim() && lastSearchedQuery.current) {
      lastSearchedQuery.current = "";
      onSearch("");
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    if (shouldMaintainFocus.current && !isLoading && inputRef.current) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
        shouldMaintainFocus.current = false;
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search GitHub users..."
            value={query}
            onChange={handleInputChange}
            className="pl-10 h-12 text-lg"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !query.trim()}
          className="h-12 px-6"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
