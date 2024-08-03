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

            </form>
        </div>
    );
}

export default AddLaptops;