"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { GitHubUser } from "@/types/github"
import { User, ExternalLink, MapPin, Users } from "lucide-react"

interface UserListProps {
  users: GitHubUser[]
  onUserSelect: (user: GitHubUser) => void
  isLoading: boolean
}

export function UserList({ users, onUserSelect, isLoading }: UserListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Search Results ({users.length} users found)
      </h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card
            key={user.id}
            className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-800"
            onClick={() => onUserSelect(user)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.login} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400">{user.login}</h3>
                    {user.name && <p className="text-gray-600 dark:text-gray-400">{user.name}</p>}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">{user.type}</span>

                      {user.public_repos !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{user.public_repos} repositories</span>
                        </div>
                      )}

                      {user.followers !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="h-3 w-3" />
                          <span>{user.followers} followers</span>
                        </div>
                      )}

                      {user.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3" />
                          <span>{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(user.html_url, "_blank")
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onUserSelect(user)
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
