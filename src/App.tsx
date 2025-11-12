import { useState } from 'react';
import { SchoolProvider, useSchool } from './contexts/SchoolContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { AlunoCard } from './components/AlunoCard';
import { ProfessorCard } from './components/ProfessorCard';
import { DisciplinaCard } from './components/DisciplinaCard';
import { GradeManagementDialog } from './components/GradeManagementDialog';
import { EnrollmentDialog } from './components/EnrollmentDialog';
import { AddPersonDialog } from './components/AddPersonDialog';
import { AddDisciplinaDialog } from './components/AddDisciplinaDialog';
import { AddFornecedorDialog } from './components/AddFornecedorDialog';
import { ContratosView } from './components/ContratosView';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { DisciplinaAlunosDialog } from './components/DisciplinaAlunosDialog';
import { Disciplina } from './types';
import {
  GraduationCap,
  Users,
  BookOpen,
  UserPlus,
  BookPlus,
  UserCog,
  Building2,
} from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

function SchoolManagementApp() {
  const { 
    alunos, 
    professores, 
    disciplinas,
    pessoasJuridicas,
    removerAluno,
    removerProfessor,
    removerDisciplina,
    removerPessoaJuridica,
    removerNota
  } = useSchool();
  
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [addAlunoDialogOpen, setAddAlunoDialogOpen] = useState(false);
  const [addProfessorDialogOpen, setAddProfessorDialogOpen] = useState(false);
  const [addDisciplinaDialogOpen, setAddDisciplinaDialogOpen] = useState(false);
  const [addFornecedorDialogOpen, setAddFornecedorDialogOpen] = useState(false);
  const [viewAlunosDialogOpen, setViewAlunosDialogOpen] = useState(false);
  
  // Delete confirmation states
  const [deleteAlunoDialogOpen, setDeleteAlunoDialogOpen] = useState(false);
  const [deleteProfessorDialogOpen, setDeleteProfessorDialogOpen] = useState(false);
  const [deleteDisciplinaDialogOpen, setDeleteDisciplinaDialogOpen] = useState(false);
  const [deleteFornecedorDialogOpen, setDeleteFornecedorDialogOpen] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const [selectedProfessorId, setSelectedProfessorId] = useState<number | null>(null);
  const [selectedDisciplinaCodigo, setSelectedDisciplinaCodigo] = useState<number | null>(null);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<number | null>(null);

  const handleManageGrades = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setGradeDialogOpen(true);
  };

  const handleViewAlunos = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    setViewAlunosDialogOpen(true);
  };

  const handleDeleteAluno = (alunoId: number) => {
    setSelectedAlunoId(alunoId);
    setDeleteAlunoDialogOpen(true);
  };

  const handleDeleteProfessor = (professorId: number) => {
    setSelectedProfessorId(professorId);
    setDeleteProfessorDialogOpen(true);
  };

  const handleDeleteDisciplina = (disciplinaCodigo: number) => {
    setSelectedDisciplinaCodigo(disciplinaCodigo);
    setDeleteDisciplinaDialogOpen(true);
  };

  const handleDeleteFornecedor = (fornecedorId: number) => {
    setSelectedFornecedorId(fornecedorId);
    setDeleteFornecedorDialogOpen(true);
  };

  const handleConfirmDeleteAluno = () => {
    if (selectedAlunoId !== null) {
      removerAluno(selectedAlunoId);
      toast.success('Aluno removido com sucesso!');
    }
    setDeleteAlunoDialogOpen(false);
  };

  const handleConfirmDeleteProfessor = () => {
    if (selectedProfessorId !== null) {
      removerProfessor(selectedProfessorId);
      toast.success('Professor removido com sucesso!');
    }
    setDeleteProfessorDialogOpen(false);
  };

  const handleConfirmDeleteDisciplina = () => {
    if (selectedDisciplinaCodigo !== null) {
      removerDisciplina(selectedDisciplinaCodigo);
      toast.success('Disciplina removida com sucesso!');
    }
    setDeleteDisciplinaDialogOpen(false);
  };

  const handleConfirmDeleteFornecedor = () => {
    if (selectedFornecedorId !== null) {
      removerPessoaJuridica(selectedFornecedorId);
      toast.success('Fornecedor removido com sucesso!');
    }
    setDeleteFornecedorDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-[1920px] mx-auto px-12 py-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8" />
            <div>
              <h1>Sistema de Gestão Escolar</h1>
              <p className="text-muted-foreground">
                Gerenciamento completo de alunos, professores e disciplinas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-12 py-8">
        <Tabs defaultValue="alunos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="alunos" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Alunos
            </TabsTrigger>
            <TabsTrigger value="professores" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Professores
            </TabsTrigger>
            <TabsTrigger value="disciplinas" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Disciplinas
            </TabsTrigger>
            <TabsTrigger value="matriculas" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Matrículas
            </TabsTrigger>
            <TabsTrigger value="contratos" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Contratos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alunos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Alunos Cadastrados ({alunos.length})</h2>
                <p className="text-muted-foreground">
                  Visualize e gerencie todos os alunos
                </p>
              </div>
              <Button onClick={() => setAddAlunoDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Aluno
              </Button>
            </div>

            <div className="grid gap-6 grid-cols-4">
              {alunos.map(aluno => (
                <AlunoCard key={aluno.ID} aluno={aluno} onDelete={handleDeleteAluno} />
              ))}
            </div>

            {alunos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum aluno cadastrado. Clique em "Adicionar Aluno" para começar.
              </div>
            )}
          </TabsContent>

          <TabsContent value="professores" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Professores Cadastrados ({professores.length})</h2>
                <p className="text-muted-foreground">
                  Visualize e gerencie todos os professores
                </p>
              </div>
              <Button onClick={() => setAddProfessorDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Professor
              </Button>
            </div>

            <div className="grid gap-6 grid-cols-3">
              {professores.map(professor => (
                <ProfessorCard key={professor.ID} professor={professor} onDelete={handleDeleteProfessor} />
              ))}
            </div>

            {professores.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum professor cadastrado. Clique em "Adicionar Professor" para começar.
              </div>
            )}
          </TabsContent>

          <TabsContent value="disciplinas" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Disciplinas Cadastradas ({disciplinas.length})</h2>
                <p className="text-muted-foreground">
                  Visualize e gerencie todas as disciplinas
                </p>
              </div>
              <Button onClick={() => setAddDisciplinaDialogOpen(true)}>
                <BookPlus className="h-4 w-4 mr-2" />
                Adicionar Disciplina
              </Button>
            </div>

            <div className="grid gap-6 grid-cols-3">
              {disciplinas.map(disciplina => (
                <DisciplinaCard
                  key={disciplina.codigo}
                  disciplina={disciplina}
                  onManageGrades={handleManageGrades}
                  onViewAlunos={handleViewAlunos}
                  onDelete={handleDeleteDisciplina}
                />
              ))}
            </div>

            {disciplinas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma disciplina cadastrada. Clique em "Adicionar Disciplina" para começar.
              </div>
            )}
          </TabsContent>

          <TabsContent value="matriculas" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2>Gestão de Matrículas</h2>
                <p className="text-muted-foreground">
                  Matricule alunos em disciplinas
                </p>
              </div>
              <Button onClick={() => setEnrollmentDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Nova Matrícula
              </Button>
            </div>

            <div className="grid gap-6 grid-cols-2">
              {disciplinas.map(disciplina => {
                const professor = professores.find(p => p.ID === disciplina.professorId);
                const disciplinaAlunos = alunos.filter(a => 
                  disciplina.alunosIds.includes(a.ID)
                );

                return (
                  <div key={disciplina.codigo} className="border rounded-lg p-6 space-y-4">
                    <div>
                      <h3>{disciplina.nome}</h3>
                      <p className="text-muted-foreground">
                        Código: {disciplina.codigo}
                      </p>
                      {professor && (
                        <p className="text-muted-foreground">
                          Professor: {professor.nome}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2">
                        Alunos matriculados: {disciplinaAlunos.length}
                      </p>
                      <div className="space-y-2">
                        {disciplinaAlunos.map(aluno => {
                          const nota = aluno.notas[disciplina.codigo];
                          return (
                            <div
                              key={aluno.ID}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <span>{aluno.nome}</span>
                              {nota !== undefined && (
                                <span className={nota >= 7 ? 'text-green-600' : 'text-red-600'}>
                                  Nota: {nota.toFixed(1)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                        {disciplinaAlunos.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">
                            Nenhum aluno matriculado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {disciplinas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Cadastre disciplinas primeiro para realizar matrículas.
              </div>
            )}
          </TabsContent>

          <TabsContent value="contratos">
            <ContratosView 
              onAddFornecedor={() => setAddFornecedorDialogOpen(true)} 
              onDeleteFornecedor={handleDeleteFornecedor}
            />
          </TabsContent>
        </Tabs>
      </main>

      <GradeManagementDialog
        disciplina={selectedDisciplina}
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
      />

      <EnrollmentDialog
        open={enrollmentDialogOpen}
        onOpenChange={setEnrollmentDialogOpen}
      />

      <AddPersonDialog
        type="aluno"
        open={addAlunoDialogOpen}
        onOpenChange={setAddAlunoDialogOpen}
      />

      <AddPersonDialog
        type="professor"
        open={addProfessorDialogOpen}
        onOpenChange={setAddProfessorDialogOpen}
      />

      <AddDisciplinaDialog
        open={addDisciplinaDialogOpen}
        onOpenChange={setAddDisciplinaDialogOpen}
      />

      <AddFornecedorDialog
        open={addFornecedorDialogOpen}
        onOpenChange={setAddFornecedorDialogOpen}
      />

      <DisciplinaAlunosDialog
        open={viewAlunosDialogOpen}
        onOpenChange={setViewAlunosDialogOpen}
        disciplina={selectedDisciplina}
      />

      <DeleteConfirmationDialog
        open={deleteAlunoDialogOpen}
        onOpenChange={setDeleteAlunoDialogOpen}
        onConfirm={handleConfirmDeleteAluno}
        title="Remover Aluno"
        description={`Tem certeza de que deseja remover o aluno ${alunos.find(a => a.ID === selectedAlunoId)?.nome}?`}
        warningMessage="Esta ação removerá todas as matrículas e notas do aluno."
      />

      <DeleteConfirmationDialog
        open={deleteProfessorDialogOpen}
        onOpenChange={setDeleteProfessorDialogOpen}
        onConfirm={handleConfirmDeleteProfessor}
        title="Remover Professor"
        description={`Tem certeza de que deseja remover o professor ${professores.find(p => p.ID === selectedProfessorId)?.nome}?`}
        warningMessage="As disciplinas atribuídas a este professor ficarão sem professor."
      />

      <DeleteConfirmationDialog
        open={deleteDisciplinaDialogOpen}
        onOpenChange={setDeleteDisciplinaDialogOpen}
        onConfirm={handleConfirmDeleteDisciplina}
        title="Remover Disciplina"
        description={`Tem certeza de que deseja remover a disciplina ${disciplinas.find(d => d.codigo === selectedDisciplinaCodigo)?.nome}?`}
        warningMessage="Todos os alunos matriculados e suas notas nesta disciplina serão removidos."
      />

      <DeleteConfirmationDialog
        open={deleteFornecedorDialogOpen}
        onOpenChange={setDeleteFornecedorDialogOpen}
        onConfirm={handleConfirmDeleteFornecedor}
        title="Remover Fornecedor"
        description={`Tem certeza de que deseja remover o fornecedor ${pessoasJuridicas.find(f => f.ID === selectedFornecedorId)?.nome}?`}
        warningMessage="Esta ação removerá todos os contratos associados a este fornecedor."
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <SchoolManagementApp />
    </SchoolProvider>
  );
}