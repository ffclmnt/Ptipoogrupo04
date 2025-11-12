import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Professor, Aluno, Administrador, Disciplina, PessoaJuridica } from '../types';
import { validateCPF, validateCNPJ } from '../utils/validation';

interface SchoolContextType {
  professores: Professor[];
  alunos: Aluno[];
  administradores: Administrador[];
  disciplinas: Disciplina[];
  pessoasJuridicas: PessoaJuridica[];
  
  // Professor methods
  adicionarProfessor: (professor: Professor) => void;
  removerProfessor: (id: number) => void;
  adicionarNota: (alunoId: number, disciplinaId: number, nota: number) => void;
  removerNota: (alunoId: number, disciplinaId: number) => void;
  
  // Aluno methods
  adicionarAluno: (aluno: Aluno) => void;
  removerAluno: (id: number) => void;
  realizarMatricula: (alunoId: number, disciplinaId: number) => void;
  consultarNota: (alunoId: number, disciplinaId: number) => number | undefined;
  
  // Disciplina methods
  adicionarDisciplina: (disciplina: Disciplina) => void;
  removerDisciplina: (codigo: number) => void;
  atribuirProfessor: (disciplinaId: number, professorId: number) => void;
  
  // Legal entity methods
  adicionarPessoaJuridica: (pessoa: PessoaJuridica) => void;
  removerPessoaJuridica: (id: number) => void;
  consultarContratos: (pessoaId: number) => PessoaJuridica | undefined;
  
  // Validation methods
  verificarCPFDuplicado: (cpf: string, excludeId?: number) => boolean;
  verificarCNPJDuplicado: (cnpj: string) => boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
};

export const SchoolProvider = ({ children }: { children: ReactNode }) => {
  // Initial mock data
  const [professores, setProfessores] = useState<Professor[]>([
    {
      ID: 1,
      nome: 'Maria Silva',
      cpf: '123.456.789-00',
      idade: '35',
      dataNascimento: '1989-05-15',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@escola.edu.br',
      endereco: { rua: 'Av. Principal', numero: '100', cidade: 'São Paulo', estado: 'SP', cep: '01000-000' },
      disciplinas: [1, 2],
      numeroInstitucional: 'INST000001',
      departamento: 'Ciências Exatas',
      titulacao: 'Mestrado'
    }
  ]);

  const [alunos, setAlunos] = useState<Aluno[]>([
    {
      ID: 1,
      nome: 'João Pedro',
      cpf: '987.654.321-00',
      idade: '20',
      dataNascimento: '2004-03-20',
      telefone: '(11) 91234-5678',
      email: 'joao.pedro@email.com',
      endereco: { rua: 'Rua das Flores', numero: '50', cidade: 'São Paulo', estado: 'SP', cep: '02000-000' },
      disciplinas: [1],
      notas: { 1: 8.5 },
      numeroMatricula: '2025001'
    },
    {
      ID: 2,
      nome: 'Ana Costa',
      cpf: '456.789.123-00',
      idade: '22',
      dataNascimento: '2002-11-10',
      telefone: '(21) 99876-5432',
      email: 'ana.costa@email.com',
      endereco: { rua: 'Rua Central', numero: '200', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20000-000' },
      disciplinas: [1, 2],
      notas: { 1: 9.0, 2: 7.5 },
      numeroMatricula: '2025002'
    }
  ]);

  const [administradores, setAdministradores] = useState<Administrador[]>([
    {
      ID: 1,
      nome: 'Carlos Admin',
      cpf: '111.222.333-44',
      idade: '45',
      dataNascimento: '1979-08-25',
      telefone: '(11) 98888-7777',
      email: 'carlos.admin@escola.edu.br',
      endereco: { rua: 'Av. Central', numero: '1', cidade: 'São Paulo', estado: 'SP', cep: '01000-001' },
    }
  ]);

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([
    {
      codigo: 1,
      nome: 'Matemática',
      professorId: 1,
      alunosIds: [1, 2]
    },
    {
      codigo: 2,
      nome: 'Física',
      professorId: 1,
      alunosIds: [2]
    }
  ]);

  const [pessoasJuridicas, setPessoasJuridicas] = useState<PessoaJuridica[]>([
    {
      ID: 1,
      nome: 'Empresa ABC Ltda',
      cnpj: '12.345.678/0001-90',
      endereco: { rua: 'Av. Empresarial', numero: '500', cidade: 'São Paulo', estado: 'SP', cep: '03000-000' },
      contratos: [
        { ID: 1, texto: 'Contrato de prestação de serviços educacionais - Vigência: 2025-2026' },
        { ID: 2, texto: 'Contrato de manutenção predial - Vigência: 2025' }
      ]
    }
  ]);

  // Professor methods
  const adicionarProfessor = (professor: Professor) => {
    setProfessores([...professores, professor]);
  };

  const removerProfessor = (id: number) => {
    setProfessores(professores.filter(p => p.ID !== id));
    // Remove professor from disciplines
    setDisciplinas(disciplinas.map(d => 
      d.professorId === id ? { ...d, professorId: undefined } : d
    ));
  };

  const adicionarNota = (alunoId: number, disciplinaId: number, nota: number) => {
    setAlunos(alunos.map(a => 
      a.ID === alunoId 
        ? { ...a, notas: { ...a.notas, [disciplinaId]: nota } }
        : a
    ));
  };

  const removerNota = (alunoId: number, disciplinaId: number) => {
    setAlunos(alunos.map(a => {
      if (a.ID === alunoId) {
        const { [disciplinaId]: _, ...restNotas } = a.notas;
        return { ...a, notas: restNotas };
      }
      return a;
    }));
  };

  // Aluno methods
  const adicionarAluno = (aluno: Aluno) => {
    setAlunos([...alunos, aluno]);
  };

  const removerAluno = (id: number) => {
    setAlunos(alunos.filter(a => a.ID !== id));
    // Remove aluno from disciplines
    setDisciplinas(disciplinas.map(d => ({
      ...d,
      alunosIds: d.alunosIds.filter(aId => aId !== id)
    })));
  };

  const realizarMatricula = (alunoId: number, disciplinaId: number) => {
    // Add discipline to student
    setAlunos(alunos.map(a => 
      a.ID === alunoId && !a.disciplinas.includes(disciplinaId)
        ? { ...a, disciplinas: [...a.disciplinas, disciplinaId] }
        : a
    ));
    
    // Add student to discipline
    setDisciplinas(disciplinas.map(d => 
      d.codigo === disciplinaId && !d.alunosIds.includes(alunoId)
        ? { ...d, alunosIds: [...d.alunosIds, alunoId] }
        : d
    ));
  };

  const consultarNota = (alunoId: number, disciplinaId: number) => {
    const aluno = alunos.find(a => a.ID === alunoId);
    return aluno?.notas[disciplinaId];
  };

  // Disciplina methods
  const adicionarDisciplina = (disciplina: Disciplina) => {
    setDisciplinas([...disciplinas, disciplina]);
  };

  const removerDisciplina = (codigo: number) => {
    setDisciplinas(disciplinas.filter(d => d.codigo !== codigo));
    // Remove from students and professors
    setAlunos(alunos.map(a => ({
      ...a,
      disciplinas: a.disciplinas.filter(d => d !== codigo),
      notas: Object.fromEntries(
        Object.entries(a.notas).filter(([k]) => Number(k) !== codigo)
      )
    })));
    setProfessores(professores.map(p => ({
      ...p,
      disciplinas: p.disciplinas.filter(d => d !== codigo)
    })));
  };

  const atribuirProfessor = (disciplinaId: number, professorId: number) => {
    setDisciplinas(disciplinas.map(d => 
      d.codigo === disciplinaId ? { ...d, professorId } : d
    ));
    setProfessores(professores.map(p => 
      p.ID === professorId && !p.disciplinas.includes(disciplinaId)
        ? { ...p, disciplinas: [...p.disciplinas, disciplinaId] }
        : p
    ));
  };

  // Legal entity methods
  const adicionarPessoaJuridica = (pessoa: PessoaJuridica) => {
    setPessoasJuridicas([...pessoasJuridicas, pessoa]);
  };

  const removerPessoaJuridica = (id: number) => {
    setPessoasJuridicas(pessoasJuridicas.filter(p => p.ID !== id));
  };

  const consultarContratos = (pessoaId: number) => {
    return pessoasJuridicas.find(p => p.ID === pessoaId);
  };

  // Validation methods
  const verificarCPFDuplicado = (cpf: string, excludeId?: number) => {
    return professores.some(p => p.cpf === cpf && p.ID !== excludeId) ||
           alunos.some(a => a.cpf === cpf && a.ID !== excludeId) ||
           administradores.some(a => a.cpf === cpf && a.ID !== excludeId);
  };

  const verificarCNPJDuplicado = (cnpj: string) => {
    return pessoasJuridicas.some(p => p.cnpj === cnpj);
  };

  return (
    <SchoolContext.Provider
      value={{
        professores,
        alunos,
        administradores,
        disciplinas,
        pessoasJuridicas,
        adicionarProfessor,
        removerProfessor,
        adicionarNota,
        removerNota,
        adicionarAluno,
        removerAluno,
        realizarMatricula,
        consultarNota,
        adicionarDisciplina,
        removerDisciplina,
        atribuirProfessor,
        adicionarPessoaJuridica,
        removerPessoaJuridica,
        consultarContratos,
        verificarCPFDuplicado,
        verificarCNPJDuplicado,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};