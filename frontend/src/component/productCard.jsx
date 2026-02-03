import { Link } from "react-router-dom";

export default function ProductCard(props){

    const product = props.product

    return (
        <Link to={"/overview/"+product.productId} className="w-[250px] h-[350px] rounded-lg shadow-2xl m-4">
            <img className="w-full h-[220px] object-cover" src={product.images[0]} alt={product.name} />
            <div className="h-[130px] w-full flex justify-center flex-col px-4">
                <p className="text-gray-400">{product.productId}</p>
                <p className="text-lg font-bold">{product.name}</p>
                <p className="text-lg text-pink-400">Rs.<span className="line-through">{product.price<product.lablePrice && product.lablePrice.toFixed(2)}</span> Rs.{product.price.toFixed(2)} </p>
            </div>
        </Link>
    );
}