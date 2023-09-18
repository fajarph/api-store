import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Database from "@ioc:Adonis/Lucid/Database"
import Order from "App/Models/Order"
import Product from "App/Models/Product"

export default class OrderController {

    public async createOrder({ request, response, auth} : HttpContextContract) {
        const trx = await Database.transaction()

        try {
            await auth.use("api").authenticate()

            const user = auth.use('api').user
            const { id_product, jumlah_product } = request.all()

            const product = await Product.find(id_product)

            if (!product) {
                await trx.rollback()
                return response.status(404).json({
                    status: 404,
                    msg: "Product tidak tersedia",
                });
            } // mencari product jika tidak ada maka akan keluar pesan ini

            if (jumlah_product > product.stok) {
                await trx.rollback()
                return response.status(400).json({
                    status: 400,
                    msg: "Stok tidak mencukupi",
                });
            } // jika jumlah product yang user ingin order lebih besar dari stock yang tersedia maka dia akan keluar pesan ini

            const newOrder = new Order()
            newOrder.fill({
                id_product,
                jumlah_product,
                user_id: user?.id
            }) 

            await newOrder.useTransaction(trx).save() // lalu di simpan di table order

            product.stok -= jumlah_product
            await product.useTransaction(trx).save() // setelah berhasil memesan, stock yang tersedia akan berkurang berdasarkan jumlah product yang di pesan oleh user

            await trx.commit()

            response.status(200).json({
                status: 200,
                msg: "Order berhasil terbuat",
                order: newOrder
            }) // response yang dikeluarkan jika berhasil
        } catch (error) {
            await trx.rollback()
            response.status(404).json({
                status: 404,
                msg: error.message
            }) // response yang dikeluarkan jika terjadi error
        }
    }
}
