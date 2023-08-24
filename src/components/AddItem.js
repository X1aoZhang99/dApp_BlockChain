import { useState } from 'react';
import { ethers } from 'ethers';

import close from '../assets/close.svg';
import imageUrl from '../assets/imageurl.json';

const AddItem = ({ dappazon, togglePopAdd, setElectronics, setClothing, setToys, provider }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [stock, setStock] = useState('');

    const categories = ['Shoes', 'Sunglasses', 'Watch', 'Camera', 'Drone', 'Headset', 'PuzzleCube', 'TrainSet', 'RobotSet']

    const handleSubmit = async (e) => {
        e.preventDefault();
        let bigNumber = await dappazon.getItemCount()
        let id = bigNumber.toNumber() + 1;

        let newCategory = ''
        if (categories.slice(0, 3).includes(category)) {
            newCategory = 'clothing';
        }
        else if (categories.slice(3, 6).includes(category)) {
            newCategory = 'electronics';
        }
        else if (categories.slice(6, 9).includes(category)) {
            newCategory = 'toys';
        }
        
        try {
        const transaction = await dappazon.connect(provider.getSigner()).list(
            id,
            name,
            newCategory,
            imageUrl[category],
            ethers.utils.parseUnits(price.toString(), 'ether'),
            rating,
            stock
        )
        await transaction.wait()
        } catch (error) {
        console.log(error)
        }

        const newItem = await dappazon.items(id);

        // Update the specific category as well
        if (newCategory === 'electronics') {
            setElectronics(prevElectronics => [...prevElectronics, newItem]);
        } else if (newCategory === 'clothing') {
            setClothing(prevClothing => [...prevClothing, newItem]);
        } else if (newCategory === 'toys') {
            setToys(prevToys => [...prevToys, newItem]);
        }
        
        togglePopAdd();
    }

    return (
        <div className="popup">
        <div className="popup_inner">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">Name:</label>
                    <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="label">Category:</label>
                    <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="" disabled hidden>Choose here</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label className="label">Price:</label>
                    <input type="text" className="input" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="label">Rating:</label>
                    <input type="number" className="input" value={rating} onChange={e => setRating(parseInt(e.target.value, 10) || '')} />
                </div>
                <div className="form-group">
                    <label className="label">Stock:</label>
                    <input type="number" className="input" value={stock} onChange={e => setStock(parseInt(e.target.value, 10) || '')} />
                </div>
                <button className='submit_button' type="submit">Add Item</button>
            </form>
            <button onClick={togglePopAdd} className="product__close">
                <img src={close} alt="Close" />
            </button>
        </div>
    </div>
    );
}

export default AddItem;
