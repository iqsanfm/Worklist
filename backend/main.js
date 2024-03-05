const express = require("express");
const cors = require("cors");
const port = 8000
const db = require("./database")

const app = express()

app.use(cors())
app.use(express.urlencoded())

app.get("/work", (_, res) => {
    db.query("SELECT * FROM worklist ORDER BY created_by DESC", (_, r) => {
        let html = ""
        r.map(data =>
            html += `<li id="items-${data.id}">${data.title} <span 
            hx-delete="http://localhost:8000/work/${data.id}" hx-trigger="click"
            hx-swap="outerHTML" hx-target="#items-${data.id}"
            hx-confirm="Apakah anda yakin akan menghapusnya!"
            >❎</span> </li>`
            )
            res.send(html)
    })
})

app.post("/work", (req,res) => {
    const title = req.body.title
    if(!title) return res.send("Tolong isi deskripsinya!")
    db.query(`INSERT INTO worklist (title) VALUES('${title}')`, (err, _) => {
        if(err) return res.send("Gagal menambahkan worklist!❎")
        res.send("Worklist Berhasil ditambahkan!")
    })
})

app.delete("/work/:id", (req,res) => {
    const id = req.params.id

    db.query(`DELETE FROM worklist WHERE id='${id}'`, (err,_) => {
        if(err) return res.send("Gagal menghapus worklist!❎")
        res.send("")
    })
})

app.listen(port, () =>{
    console.log(`server running ${port}`)
})

