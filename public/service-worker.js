self.addEventListener("install", (event) => {
     event.waitUntil(
         caches.open("simplify-editor-cache").then((cache) => {
             cache.addAll([
                 "/",
                 "/index.html",
                 "/styles.css",
                 "/bundle.js"
             ])
         })
     )
})


self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheName) => {
            return Promise.all(
                cacheName.map((cache) => {
                    if(cache !== "simplify-editor-cache"){
                        caches.delete(cache)
                    }
                })
            )
        })
    )
})

self.addEventListener("activate", (event) => {
    event.responsdWith(
        fetch(event.request).catch(()=> {
            return caches.match(event.request).then((res)=> {
                if(res) return res

                return  caches.match("/offline.html")
            })
        })
    )
})