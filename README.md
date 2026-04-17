# Comunicação

Toda a comunicação a respeito deste teste deve ser feita através do email thiago.barros@prestadores.aplis.inf.br. 

# Entrega

- O prazo para entrega do teste é de 10 dias após seu envio ao candidato.
- O teste pode ser entregue parcialmente, porém a porcentagem de aderencia ao escopo total será avaliada.

# Recomendações

- Recomendamos uso de arquitetura MVC em ambos os backends.
- Recomendamos que o pull request tem a menor quantidade possível de arquivos para cumprir o desafio.

## Teste Prático — Desenvolvedor Junior

- Para iniciar crie um fork deste repositório para seu perfil.
- Para entregar crie uma solicitação pull request.

O teste consiste no desenvolvimento de uma aplicação fullstack simples, composta por um frontend em React (SPA), dois backends independentes e um banco de dados MySQL compartilhado.

O backend em PHP será responsável pelo cadastro e listagem de médicos, enquanto o backend em Node.js será responsável pelo cadastro e listagem de pacientes. Cada backend deve expor endpoints REST para criação e consulta de seus respectivos dados, garantindo que as respostas estejam em formato JSON consistente.

O primeiro backend deverá ser desenvolvido em PHP e contemplar as seguintes rotas:
- `GET /api/v1/medicos`: obtém todos os médicos retornando conforme exemplo abaixo: 

```json
    [
        {
            "id": 1,
            "nome": "João da Silva",
            "CRM": "123456",
            "UFCRM": "CE"
        },
        {
            "id": 2,
            "nome": "Francisco Pereira",
            "CRM": "876543",
            "UFCRM": "CE"
        }
    ]
```

- `POST /api/v1/medicos`: cria um novo médico enviando o body do exemplo abaixo e retornando a mensagem "Médico criado com sucesso".

```json
    {
        "id": 1,
        "nome": "João da Silva",
        "CRM": "123456",
        "UFCRM": "CE"
    }
```

O segundo backend deverá ser desenvolvido em NodeJS (JavaScript) e contemplar as seguintes rotas:
- `GET /api/v1/pacientes`: obtém todos os pacientes retornando conforme exemplo abaixo: 

```json
    [
        {
            "id": 1,
            "nome": "João da Silva",
            "dataNascimento": "2026-01-01",
            "carteirinha": "123456",
            "cpf": "12345678909"
        },
        {
            "id": 2,
            "nome": "Francisco Pereira",
            "carteirinha": "876543",
            "cpf": "12345678901"
        }
    ]
```

- `POST /api/v1/pacientes`: cria um novo paciente enviando o body do exemplo abaixo e retornando a mensagem "Paciente criado com sucesso".

```json
    {
        "id": 1,
        "nome": "João da Silva",
        "dataNascimento": "2026-01-01",
        "carteirinha": "123456",
        "cpf": "12345678909"
    },
```

O frontend deve consumir ambas as APIs, permitindo visualizar listas de médicos e pacientes separadamente, além de possibilitar o cadastro de novos registros. O candidato deverá organizar o projeto em três partes (frontend, backend Node e backend PHP), garantir a integração entre as camadas e manter o código legível e funcional.

A tela deve mostrar um menu sidebar à esquerda com duas opções (Médicos e Pacientes), que quando clicado abre a tela de listagem e criação dos registros.

A avaliação considerará principalmente o funcionamento ponta a ponta da aplicação, a correta integração entre os serviços, a organização do código e, como diferencial, boas práticas, tratamento de erros e clareza na documentação. O tempo estimado para conclusão é de 6 a 10 horas.


# Desafio extra 

- Crie as demais operações CRUD
- Deixe o projeto pronto para multi linguagem, tanto no backend quanto no frontend.