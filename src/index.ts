import  Express  from "express";
import UserRouter from "./router/userRouter"
import InventoryRouter from "./router/inventoryRouter"

const app = Express()
app.use(Express.json())

app.use(`/user`, UserRouter)
app.use(`/inventory`, InventoryRouter)

const PORT = 3036
app.listen(PORT, ()=>{
    console.log(`Server peminjaman run on port ${PORT}`)
})