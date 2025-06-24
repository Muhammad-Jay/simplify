import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        "https://huftoobyzxsizjmitsbp.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZnRvb2J5enhzaXpqbWl0c2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDY2MjAsImV4cCI6MjA1NzI4MjYyMH0.c1oKu_z8fIE99fJwIe3oqV9_7i2SFQRJUqR2bX_7q2g"
    )
}