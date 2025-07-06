class ValidaCPF {
    constructor(cpf) {
        if (cpf === undefined) return;

        Object.defineProperty(this, 'cpfLimpo', {
            get: function () {
                return cpf.replace(/\D+/g, '');
            }
        })
    }

    valid() {
        if (this.cpfLimpo === undefined) return false;
        if (this.cpfLimpo.length !== 11) return false;
        if (this.isSeq()) return false;

        const cpfParcial = this.cpfLimpo.slice(0, -2);
        const calculo1 = this.calculo(cpfParcial);
        const calculo2 = this.calculo(cpfParcial + calculo1);

        if ((calculo1 + calculo2) !== this.cpfLimpo.slice(-2)) return false;

        return true;
    }

    calculo(cpfParcial) {
        const arrayCPF = Array.from(cpfParcial);
        let regressivo = arrayCPF.length + 1;

        const digito = arrayCPF.reduce((ac, val) => {
            ac += (regressivo * Number(val));
            regressivo--;
            return ac;
        }, 0)

        let primeiroDigito = 11 - (digito % 11);

        return primeiroDigito > 9 ? '0' : String(primeiroDigito);
    }

    isSeq() {
        return this.cpfLimpo[0].repeat(11) === this.cpfLimpo;
    }

}

class ValidaFormulario {
    constructor() {
        this.form = document.querySelector('#form');
        this.events();
    }

    events() {
        this.form.addEventListener('submit', e => {
            this.handleSubmit(e);
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const checkFields = this.checkFields();

        if(checkFields){
            this.sendForm();
        }
    }

    checkFields() {
        let valid = true;

        this.form.querySelectorAll('.error-text').forEach((e) => {
            e.innerHTML = '';
        })

        this.form.querySelectorAll('.valid').forEach((e) => {
            if (!e.value) {
                this.createError(e, `O campo "<strong>${e.name}</strong>" não pode estár vazio`);
                valid = false;
            }

            if (e.classList.contains('CPF')) {
                if (!this.validaCPF(e)) valid = false;
            }

            if (e.classList.contains('usuario')) {
                if (!/^[a-zA-Z0-9]+$/.test(e.value)) {
                    this.createError(e, `O "<strong>${e.name}</strong>" só pode conter letras e/ou números`)
                    valid = false;
                }

                if (e.value.length < 3 || e.value.length > 12) {
                    this.createError(e, `O "<strong>${e.name}</strong>" deve ter no mínimo 3 letras e no máximo 12`)
                    valid = false;
                }
            }

            if (e.classList.contains('password')) {
                if (e.value.length < 6 || e.value.length > 12) {
                    this.createError(e, `A "<strong>${e.name}</strong>" precisa ter entre 6 e 12 caracteres`)
                    valid = false;
                }
            }

            if (e.classList.contains('repsenha')) {
                if (!this.validPass(e)) valid = false;
            }
        })

        return valid;
    }

    validPass(campo) {
        this.pass1 = document.querySelector('#senha')
        this.pass2 = document.querySelector('#repsenha');

        if (this.pass1.value !== this.pass2.value) {
            const label = this.form.querySelector('label[for="senha2"]');
            const clear = label.innerText.replace(':', '');
            this.createError(campo, `O campo "<strong>${clear}</strong>" deve ser igual à senha`);
            return false;
        }

        return true;
    }

    validaCPF(campo) {
        const CPF = new ValidaCPF(campo.value)

        if (!CPF.valid()) {
            this.createError(campo, 'CPF inválido');
            return false;
        }

        return true;
    }

    createError(campo, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        campo.insertAdjacentElement('afterend', div);
    }

    sendForm(){
        this.result = document.querySelector('#resultado');
        this.result.classList.add('sendForm');
        this.result.innerHTML = `Formulário enviado`;
    }

}

const validaForm = new ValidaFormulario();