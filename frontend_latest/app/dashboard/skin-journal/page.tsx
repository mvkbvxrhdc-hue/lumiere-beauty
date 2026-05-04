"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  Droplets,
  Sun,
  Wind,
  Smile,
  Frown,
  Meh,
  Camera,
  Tag,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

const moodOptions = [
  { icon: Smile, label: "Great", color: "text-emerald-500 bg-emerald-50", border: "border-emerald-300" },
  { icon: Meh, label: "Okay", color: "text-amber-500 bg-amber-50", border: "border-amber-300" },
  { icon: Frown, label: "Bad", color: "text-rose-500 bg-rose-50", border: "border-rose-300" },
]

const conditionTags = ["Hydrated", "Oily", "Dry", "Breakout", "Glowing", "Sensitive", "Dull", "Clear"]

const sampleEntries = [
  {
    id: 1,
    date: "Today, Apr 9",
    mood: "Great",
    moodIcon: Smile,
    moodColor: "text-emerald-500",
    content: "Skin feeling really smooth after starting the new Vitamin C serum last week. The dark spots around my cheekbones are definitely fading — so excited about the progress!",
    tags: ["Glowing", "Hydrated"],
    weather: "Sunny",
    likes: 24,
    comments: 6,
    saved: true,
    skinScore: 89,
  },
  {
    id: 2,
    date: "Yesterday, Apr 8",
    mood: "Okay",
    moodIcon: Meh,
    moodColor: "text-amber-500",
    content: "A little congestion around the nose today. Might be the new moisturizer — going to patch test a different formula. Used the clay mask in the evening and felt a lot better.",
    tags: ["Oily", "Breakout"],
    weather: "Cloudy",
    likes: 8,
    comments: 3,
    saved: false,
    skinScore: 72,
  },
  {
    id: 3,
    date: "Apr 7",
    mood: "Great",
    moodIcon: Smile,
    moodColor: "text-emerald-500",
    content: "Week 3 with retinol 0.5% — no more peeling! The initial dryness is gone and texture is visibly smoother. Still using it just twice a week to stay safe.",
    tags: ["Clear", "Glowing"],
    weather: "Windy",
    likes: 41,
    comments: 12,
    saved: true,
    skinScore: 91,
  },
]

const weatherIcons: Record<string, React.ElementType> = {
  Sunny: Sun,
  Cloudy: Wind,
  Windy: Wind,
}

export default function SkinJournalPage() {
  const [isWriting, setIsWriting] = useState(false)
  const [newEntry, setNewEntry] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [likedIds, setLikedIds] = useState<number[]>([])
  const [savedIds, setSavedIds] = useState([1, 3])

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])

  const toggleLike = (id: number) =>
    setLikedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])

  const toggleSave = (id: number) =>
    setSavedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])

  return (
    <div className="min-h-screen bg-[#f5f4f8]">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Skin Journal</h1>
            <p className="text-sm text-gray-400 mt-0.5">Track your skin story, day by day</p>
          </div>
          <Button
            onClick={() => setIsWriting(!isWriting)}
            className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl h-9 px-4 text-sm font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />New Entry
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Entries", value: "28", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
            { label: "Avg Score", value: "84", icon: Droplets, color: "bg-sky-50 text-sky-600" },
            { label: "Best Streak", value: "21d", icon: Sun, color: "bg-amber-50 text-amber-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 px-4 py-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">{value}</div>
                <div className="text-[11px] text-gray-400 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* New entry composer */}
        {isWriting && (
          <div className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="text-sm font-bold text-gray-900">How is your skin today?</h3>
            </div>
            <div className="p-5 space-y-4">
              {/* Mood */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Mood</label>
                <div className="flex items-center gap-2">
                  {moodOptions.map(({ icon: Icon, label, color, border }) => (
                    <button
                      key={label}
                      onClick={() => setSelectedMood(label)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                        selectedMood === label ? `${color} ${border}` : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="w-4 h-4" />{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              <Textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Write about your skin today — what's working, what's not, how you feel..."
                className="resize-none border-gray-100 bg-gray-50 rounded-xl text-sm text-gray-700 placeholder:text-gray-300 min-h-[100px] focus:border-violet-300 focus:ring-0"
              />

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Skin Condition</label>
                <div className="flex flex-wrap gap-1.5">
                  {conditionTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                        selectedTags.includes(tag)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-violet-300"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <Camera className="w-4 h-4" />Photo
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <Tag className="w-4 h-4" />Products
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsWriting(false)} className="text-gray-400 hover:text-gray-600 text-xs">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!newEntry.trim() || !selectedMood}
                    className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold px-4"
                  >
                    Save Entry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entries */}
        <div className="space-y-3">
          {sampleEntries.map((entry) => {
            const MoodIcon = entry.moodIcon
            const WeatherIcon = weatherIcons[entry.weather] || Sun
            const liked = likedIds.includes(entry.id)
            const saved = savedIds.includes(entry.id)
            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-violet-100 hover:shadow-sm transition-all">
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MoodIcon className={`w-4 h-4 ${entry.moodColor}`} />
                      <span className="text-sm font-bold text-gray-900">{entry.date}</span>
                      <span className="text-gray-200">·</span>
                      <WeatherIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400">{entry.weather}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-violet-50 rounded-xl px-2.5 py-1">
                        <TrendingUp className="w-3 h-3 text-violet-500" />
                        <span className="text-xs font-bold text-violet-700">{entry.skinScore}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{entry.content}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 px-5 py-3 border-t border-gray-50">
                  <button
                    onClick={() => toggleLike(entry.id)}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                      liked ? "bg-rose-50 text-rose-500" : "text-gray-400 hover:bg-gray-50")}
                  >
                    <Heart className={cn("w-3.5 h-3.5", liked && "fill-rose-500")} />
                    {entry.likes + (liked ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-50 transition-all">
                    <MessageCircle className="w-3.5 h-3.5" />{entry.comments}
                  </button>
                  <button
                    onClick={() => toggleSave(entry.id)}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ml-auto",
                      saved ? "bg-violet-50 text-violet-600" : "text-gray-400 hover:bg-gray-50")}
                  >
                    <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-violet-500")} />
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            )
          })}
          <button className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronDown className="w-4 h-4" />Load more entries
          </button>
        </div>

      </div>
    </div>
  )
}
