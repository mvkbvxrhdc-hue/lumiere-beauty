"use client"

import { useCommunity } from "@/contexts/community-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Eye, Bookmark, Share2, UserPlus, UserCheck } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { VideoPlayer } from "@/components/video-player"

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const {
    posts,
    comments,
    likedPosts,
    likedComments,
    savedPosts,
    followedUsers,
    toggleLikePost,
    toggleLikeComment,
    toggleSavePost,
    toggleFollowUser,
    addComment,
  } = useCommunity()

  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const post = posts.find((p) => p.id === params.id)
  if (!post) {
    notFound()
  }

  const postComments = comments.filter((c) => c.postId === params.id && !c.parentId)
  const isFollowing = followedUsers.has(post.author.name)

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    addComment({
      postId: params.id,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: newComment,
    })

    setNewComment("")
    toast.success("Comment added!")
  }

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply")
      return
    }

    addComment({
      postId: params.id,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      content: replyContent,
      parentId,
    })

    setReplyContent("")
    setReplyingTo(null)
    toast.success("Reply added!")
  }

  const getReplies = (commentId: string) => {
    return comments.filter((c) => c.parentId === commentId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/dashboard/community" className="hover:text-foreground">
          Community
        </Link>
        {" / "}
        <span className="text-foreground">{post.title}</span>
      </div>

      {/* Post Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {post.author.role} • {post.createdAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={() => {
                  toggleFollowUser(post.author.name)
                  toast.success(isFollowing ? "Unfollowed" : "Following")
                }}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="mr-1 h-4 w-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-1 h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {post.videoUrl && (
            <div className="rounded-lg overflow-hidden my-6">
              <VideoPlayer url={post.videoUrl} title={post.title} />
            </div>
          )}
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleLikePost(post.id)
                toast.success(likedPosts.has(post.id) ? "Unliked" : "Liked!")
              }}
              className={likedPosts.has(post.id) ? "text-red-500" : ""}
            >
              <Heart className={`mr-1 h-5 w-5 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
              {post.likes}
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              {post.comments}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-5 w-5" />
              {post.views}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toggleSavePost(post.id)
                toast.success(savedPosts.has(post.id) ? "Post unsaved" : "Post saved")
              }}
            >
              <Bookmark className={`h-5 w-5 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Comments ({postComments.length})</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddComment}>Post Comment</Button>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {postComments.map((comment) => {
              const replies = getReplies(comment.id)
              return (
                <div key={comment.id} className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{comment.author.name}</p>
                        <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toggleLikeComment(comment.id)
                          }}
                          className={likedComments.has(comment.id) ? "text-red-500" : ""}
                        >
                          <Heart className={`mr-1 h-3 w-3 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                          {comment.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          Reply
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="space-y-2 mt-3">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                              Post Reply
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {replies.length > 0 && (
                        <div className="ml-6 mt-4 space-y-4 border-l-2 pl-4">
                          {replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm">{reply.author.name}</p>
                                  <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{reply.content}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleLikeComment(reply.id)}
                                  className={likedComments.has(reply.id) ? "text-red-500" : ""}
                                >
                                  <Heart
                                    className={`mr-1 h-3 w-3 ${likedComments.has(reply.id) ? "fill-current" : ""}`}
                                  />
                                  {reply.likes}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {postComments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
