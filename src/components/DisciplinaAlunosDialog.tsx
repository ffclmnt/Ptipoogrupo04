import { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { Disciplina } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface DisciplinaAlunosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disciplina: Disciplina | null;
}

export function DisciplinaAlunosDialog({
  open,
  onOpenChange,
  disciplina,
}: DisciplinaAlunosDialogProps) {
  const { alunos, professores, removerNota } = useSchool();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);

  if (!disciplina) return null;

  const professor = professores.find(p => p.ID === disciplina.professorId);
  const disciplinaAlunos = alunos.filter(a => disciplina.alunosIds.includes(a.ID));

  const handleRemoveAluno = (alunoId: number) => {
    setSelectedAlunoId(alunoId);
    setDeleteDialogOpen(true);
  };

  const confirmRemoveAluno = () => {
    if (selectedAlunoId && disciplina) {
      removerNota(selectedAlunoId, disciplina.codigo);
      toast.success('Aluno removido da disciplina com sucesso!');
      setSelectedAlunoId(null);
    }
  };

  const selectedAluno = alunos.find(a => a.ID === selectedAlunoId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[900px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {disciplina.nome}
            </DialogTitle>
            <DialogDescription>
              Código: {disciplina.codigo} | 
              {professor ? ` Professor: ${professor.nome}` : ' Sem professor atribuído'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h3>Alunos Matriculados ({disciplinaAlunos.length})</h3>
              </div>
            </div>

            {disciplinaAlunos.length > 0 ? (
              <div className="space-y-3">
                {disciplinaAlunos.map(aluno => {
                  const nota = aluno.notas[disciplina.codigo];
                  return (
                    <div
                      key={aluno.ID}
                      className="border rounded-lg p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{aluno.nome}</p>
                            <div className="flex gap-2 mt-1">
                              <p className="text-sm text-muted-foreground">
                                CPF: {aluno.cpf}
                              </p>
                              {aluno.numeroMatricula && (
                                <p className="text-sm text-muted-foreground">
                                  | Matrícula: {aluno.numeroMatricula}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {nota !== undefined ? (
                          <Badge 
                            variant={nota >= 7 ? 'default' : 'destructive'}
                            className="min-w-[80px] justify-center"
                          >
                            Nota: {nota.toFixed(1)}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="min-w-[80px] justify-center">
                            Sem nota
                          </Badge>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAluno(aluno.ID)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/30">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum aluno matriculado nesta disciplina</p>
                <p className="text-sm mt-1">
                  Use a aba "Matrículas" para adicionar alunos
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmRemoveAluno}
        title="Remover Aluno da Disciplina"
        description={`Tem certeza que deseja remover ${selectedAluno?.nome} da disciplina ${disciplina.nome}?`}
        warningMessage="A nota do aluno nesta disciplina será removida permanentemente."
      />
    </>
  );
}
