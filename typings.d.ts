type Tag = {
  id: string
  tag: string
  created_at: Date
  username: string
  count: Count
}
type Count = {
  count: number
}
type SearchTag = {
  tag: string
  id: string
}
type Vote = {
  email
  created_at
  id
}
type Comemnt = {
  id: string
  body: string
  email: string
  username: string
  created_at: Date
  post_id: string
  votes: [Vote]
}
type Topic = {
  id: string
  title: string
  body: string
  tag: Tag
  featured: string
  tag_id: string
  username: string
  created_at: Date
  email: string
  profile: string
  comments: [Comemnt]
  votes: [Vote]
}
