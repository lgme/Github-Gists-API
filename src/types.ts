export interface Gist {
    id: string
    description: string | null
    html_url: string
    created_at: string
    files: GistFile[]
}

export interface GistFile {
    filename: string
    language: string
    raw_url: string
    type: string
    size: number
    color: string
}

export interface UserInfo {
    id: string
    name: string
    login: string
    bio: string | null
    location: string
    avatar_url: string | ''
}
  