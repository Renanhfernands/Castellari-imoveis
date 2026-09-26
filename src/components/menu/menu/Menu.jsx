import { useState } from "react";
import "./Menu.css";

function Menu() {
    const [menuAberto, setMenuAberto] = useState (false);

    return (
        <>
        <button
        ClassName="menu-button"
        onClick={() => setMenuAberto (!menuAberto)}
    >
    ☰
    </button>

    <div className={menu ${menuAberto ? "aberto" : ""}}>
        <a href="#imoveis" onClick=() => serMenuAberto(false)}>
        imóveis
       </a>

       <a href="#diferenciais" onClick={() => setMenuAberto(false)}>
        Diferenciais
       </a>

       <a href="#como-funciona" onClick={() => setMenuAberto(false)}>
        Como Funciona
       </a>
       </div>
       </>
       );
    }

    export default Menu;