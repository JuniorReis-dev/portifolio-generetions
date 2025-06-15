// formHandler.js - Responsável pela validação e envio do formulário
class FormHandler {
  constructor(formId) {
    this.form = document.querySelector(formId);
    this.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (event) => this.handleSubmit(event));
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    // Validar nome
    const campoNome = document.querySelector("#nome");
    const txtNome = document.querySelector("#txtNome");

    if (campoNome.value.length < 3) {
      this.showError(txtNome, "O Nome deve ter no mínimo 3 caracteres");
      campoNome.focus();
      return;
    } else {
      this.clearError(txtNome);
    }

    // Validar email
    const campoEmail = document.querySelector("#email");
    const txtEmail = document.querySelector("#txtEmail");

    if (!campoEmail.value.match(this.emailRegex)) {
      this.showError(txtEmail, "Digite um e-mail válido");
      campoEmail.focus();
      return;
    } else {
      this.clearError(txtEmail);
    }

    // Validar assunto
    const campoAssunto = document.querySelector("#assunto");
    const txtAssunto = document.querySelector("#txtAssunto");

    if (campoAssunto.value.length < 5) {
      this.showError(txtAssunto, "O Assunto deve ter no mínimo 5 caracteres");
      campoAssunto.focus();
      return;
    } else {
      this.clearError(txtAssunto);
    }

    // Mostrar feedback de sucesso
    this.showSuccessMessage();

    // Enviar o formulário após um pequeno delay para mostrar o feedback
    setTimeout(() => {
      this.form.submit();
    }, 1500);
  }

  showError(element, message) {
    element.innerHTML = message;
    element.style.color = "#f67c7c";
  }

  clearError(element) {
    element.innerHTML = "";
  }

  showSuccessMessage() {
    // Criar elemento de sucesso se não existir
    let successMessage = document.querySelector("#success-message");
    if (!successMessage) {
      successMessage = document.createElement("div");
      successMessage.id = "success-message";
      successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #20c65a, #25d366);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(successMessage);
    }

    successMessage.innerHTML = `
      <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
      <p style="margin: 0; font-size: 1.1rem;">Mensagem enviada com sucesso!</p>
      <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Redirecionando...</p>
    `;

    // Mostrar a mensagem
    setTimeout(() => {
      successMessage.style.opacity = "1";
    }, 100);

    // Ocultar após 1.2 segundos
    setTimeout(() => {
      successMessage.style.opacity = "0";
      setTimeout(() => {
        if (successMessage.parentNode) {
          successMessage.parentNode.removeChild(successMessage);
        }
      }, 300);
    }, 1200);
  }
}

// Inicializar o manipulador de formulário quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  new FormHandler("#formulario");
});
