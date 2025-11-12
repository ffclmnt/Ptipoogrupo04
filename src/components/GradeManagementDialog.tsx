import { useState } from 'react';
import { Disciplina } from '../types';
import { useSchool } from '../contexts/SchoolContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Award } from 'lucide-react';

interface GradeManagementDialogProps {
  disciplina: Disciplina | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GradeManagementDialog({
  disciplina,
  open,
  onOpenChange,
}: GradeManagementDialogProps) {
  const { alunos, adicionarNota, removerNota } = useSchool();
  const [grades, setGrades] = useState<{ [alunoId: number]: string }>({});

  if (!disciplina) return null;

  const disciplinaAlunos = alunos.filter(a => disciplina.alunosIds.includes(a.ID));

  const handleSaveGrade = (alunoId: number) => {
    const gradeValue = parseFloat(grades[alunoId]);
    if (!isNaN(gradeValue) && gradeValue >= 0 && gradeValue <= 10) {
      adicionarNota(alunoId, disciplina.codigo, gradeValue);
      setGrades({ ...grades, [alunoId]: '' });
    }
  };

  const handleRemoveGrade = (alunoId: number) => {
    removerNota(alunoId, disciplina.codigo);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Gerenciar Notas - {disciplina.nome}
          </DialogTitle>
          <DialogDescription>
            Adicione ou remova notas dos alunos matriculados nesta disciplina
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {disciplinaAlunos.map(aluno => {
            const currentGrade = aluno.notas[disciplina.codigo];
            return (
              <div key={aluno.ID} className="border rounded-lg p-4 space-y-3">
                <div>
                  <p>{aluno.nome}</p>
                  <p className="text-muted-foreground">CPF: {aluno.cpf}</p>
                  {currentGrade !== undefined && (
                    <p className="text-muted-foreground">
                      Nota Atual: <span className={currentGrade >= 7 ? 'text-green-600' : 'text-red-600'}>{currentGrade.toFixed(1)}</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`grade-${aluno.ID}`}>Nova Nota (0-10)</Label>
                    <Input
                      id={`grade-${aluno.ID}`}
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={grades[aluno.ID] || ''}
                      onChange={(e) =>
                        setGrades({ ...grades, [aluno.ID]: e.target.value })
                      }
                      placeholder="Digite a nota"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <Button onClick={() => handleSaveGrade(aluno.ID)}>
                      Salvar
                    </Button>
                    {currentGrade !== undefined && (
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveGrade(aluno.ID)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {disciplinaAlunos.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum aluno matriculado nesta disciplina
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
