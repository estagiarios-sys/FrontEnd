export default function Footer(props){
    return (
        <footer className="footer">
        <span className="copyright-text">©  Copyright 2024 - Systextil - Todos os direitos reservados</span>
        <div className="text-and-logo">
          <img src={props.logoSystextil} alt="Descrição da Imagem" />
          <span className="separator">|</span>
          <span>Simplificando a cadeia têxtil!</span>
        </div>
      </footer>
    )
}