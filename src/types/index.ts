// Base types matching the class diagram

export interface Endereco {
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Pessoa {
  ID: number;
  nome: string;
  endereco: Endereco;
  telefone: string;
  email: string;
}

export interface PessoaFisica extends Pessoa {
  cpf: string;
  idade: string;
  dataNascimento: string;
}

export interface PessoaJuridica extends Pessoa {
  cnpj: string;
  contratos: Contrato[];
  ramoAtividade?: string;
  dadosBancarios?: {
    banco: string;
    agencia: string;
    conta: string;
  };
}

export interface Professor extends PessoaFisica {
  disciplinas: number[]; // IDs of disciplines
  numeroInstitucional?: string;
  departamento: string;
  titulacao: string;
}

export interface Aluno extends PessoaFisica {
  disciplinas: number[]; // IDs of disciplines
  notas: { [disciplinaId: number]: number };
  numeroMatricula?: string;
}

export interface Administrador extends PessoaFisica {}

export interface Disciplina {
  codigo: number;
  nome: string;
  professorId?: number;
  alunosIds: number[];
}

export interface Contrato {
  ID: number;
  texto: string;
}

export interface ValidationError {
  field: string;
  message: string;
}