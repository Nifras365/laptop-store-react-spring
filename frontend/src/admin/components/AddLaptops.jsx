import React, {useState} from "react";
import '../css/AddLaptops.css';

const AddLaptops = () =>{
    const[price, setPrice] = useState('');
    const[description, setDescription] = useState('');
    const[image, setImage] = useState('');

    return(
        <div>
            This page is for add laptops
            <form>
                <div>
                    <label>Price: </label>
                    <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    required
                    />
                </div>

            </form>
        </div>
    );
}

export default AddLaptops;