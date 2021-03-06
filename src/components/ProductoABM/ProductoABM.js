import React, { useState, useEffect } from 'react'
import './ProductoABM.css'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Modal, Fade, Backdrop, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';


const ProductoABM = (props) => {

    //const admin = props.admin;

    const [productos, setProductos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);
    const [newProducto, setNewProducto] = useState({ sku: '', name: '', stock: '', unitPrice: '', category: '' });

    useEffect(() => {
        async function getProductos() {

            let h = new Headers();
            h.append('Accept', 'application/json');

            let response = await fetch('https://master-market.azurewebsites.net/api/Product/GetAll', {
                method: 'GET',
                mode: 'cors',
                headers: h,
                cache: 'default'
            });
            let data = await response.json();

            console.log(data)

            return data;
        }

        getProductos().then(
            (items) => {
                setProductos(items.productos);
            }
        )
    }, []);

    function createProducto() {
        let updProductos = [...productos]
        updProductos.push(newProducto)
        setProductos(updProductos)
        setOpenModal(false)
    }

    function deleteProducto(e) {

        let updProductos = [...productos]

        let i = updProductos.indexOf(e);
        i !== -1 && updProductos.splice(i, 1);

        setProductos(updProductos);

    }

    function handleInput(e) {

        let newProd = { ...newProducto }

        if (e.target.id === 'sku') {
            newProd.sku = e.target.value;
        } else if (e.target.id === 'name') {
            newProd.name = e.target.value;
        } else if (e.target.id === 'stock') {
            newProd.stock = e.target.value;
        } else if (e.target.id === 'unitPrice') {
            newProd.unitPrice = e.target.value;
        } else if (e.target.id === 'category') {
            newProd.category = e.target.value;
        }

        setNewProducto(newProd);
    }

    function formCreateProducto() {
        return (
            <div className="formNewProd">
                <h2>Registrar nuevo producto</h2>
                <p>Código</p>
                <input id='sku' onChange={(e) => handleInput(e)} />
                <p>Nombre</p>
                <input id='name' onChange={(e) => handleInput(e)} />
                <p>Stock</p>
                <input id='stock' onChange={(e) => handleInput(e)} />
                <p>Category</p>
                <input id='category' onChange={(e) => handleInput(e)} />
                <p>Precio unitario</p>
                <input id='unitPrice' style={{ marginBottom: "20px" }} onChange={(e) => handleInput(e)} />

                <Button variant="contained" color="primary" onClick={() => createProducto()}>REGISTRAR</Button>
            </div>
        )
    }

    function viewProduct() {

        return (
            <div>
                <h2>Detalle de producto</h2>
                <h4>Código: </h4>
                <p>{selectedProd.sku}</p>
                <h4>Nombre: </h4>
                <p>{selectedProd.name}</p>
                <h4>Stock: </h4>
                <p>{selectedProd.stock}</p>
                <h4>Precio unitario: </h4>
                <p>{selectedProd.unitPrice}</p>
            </div>
        )
    }

    function renderList(e) {

        return (
            <ListItem key={`${e.sku}-${e.name}`} button
                onClick={() => {
                    console.log(e)
                    setOpenModal(true);
                    setSelectedProd(e);
                }}>
                <ListItemText
                    primary={e.name}
                    secondary={e.sku}
                />
                <p>Stock:</p>
                <p>{e.stock}</p>
                <p>Precio unitario:</p>
                <p>{e.unitPrice}</p>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteProducto(e)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }

    return (
        <div className="menu-productos">

            <h2>Lista de Productos</h2>
            <div className="list-productos-registro">
                <List>
                    {productos.map((e) => renderList(e))}
                </List>
            </div>

            <div className="botonera-productos">
                <Button variant="contained" color="primary"
                    onClick={() => {
                        setSelectedProd(null)
                        setOpenModal(true)
                    }}
                >Registrar producto</Button>
            </div>

            <Modal className="modal"
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <div className="profile-producto">
                        {selectedProd ? viewProduct() : formCreateProducto()}
                    </div>
                </Fade>
            </Modal>
        </div >
    )

}
export default ProductoABM;