import { useDispatch } from "react-redux";
import Banner from "../../components/Banner/Banner";
import { removeFromCart } from "../../reducers/cartReducer";
import OrderForm from "../../components/OrderForm/OrderForm";
import { useAppSelector } from "../../utils/hooks";

export default function Cart() {

    const itemsInCart = useAppSelector(state => state.cart);

    const dispatch = useDispatch();

    return (
        <>
            <main className="container">
                <div className="row">
                    <div className="col">
                        <Banner />
                        <section className="cart">
                            <h2 className="text-center">Корзина</h2>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Название</th>
                                        <th scope="col">Размер</th>
                                        <th scope="col">Кол-во</th>
                                        <th scope="col">Стоимость</th>
                                        <th scope="col">Итого</th>
                                        <th scope="col">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsInCart.data && itemsInCart.data.map((item, index) =>
                                        <tr>
                                            <td scope="row">{index + 1}</td>
                                            <td><a href={`/catalog/${item.id}.html`}>{item.title}</a></td>
                                            <td>{item.size}</td>
                                            <td>{item.amount}</td>
                                            <td>{item.price}</td>
                                            <td>{item.totalPrice}</td>
                                            <td><button className="btn btn-outline-danger btn-sm" onClick={() => { dispatch(removeFromCart({
                                                    title: item.title,
                                                    size: item.size,
                                                    amount: item.amount,
                                                    price: item.price,
                                                    id: item.id
                                                })) }}>Удалить</button></td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td colSpan={5} className="text-right">Общая стоимость</td>
                                        <td>{itemsInCart.totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                        <OrderForm/>
                    </div>
                </div>
            </main>
            <script>
            </script>
        </>
    )
}