import { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollmentDialog({ open, onOpenChange }: EnrollmentDialogProps) {
  const { alunos, disciplinas, realizarMatricula } = useSchool();
  const [selectedAluno, setSelectedAluno] = useState<string>('');
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>('');

  const handleEnroll = () => {
    if (!selectedAluno || !selectedDisciplina) {
      toast.error('Selecione um aluno e uma disciplina');
      return;
    }

    const alunoId = parseInt(selectedAluno);
    const disciplinaId = parseInt(selectedDisciplina);

    const aluno = alunos.find(a => a.ID === alunoId);
    const disciplina = disciplinas.find(d => d.codigo === disciplinaId);

    if (aluno?.disciplinas.includes(disciplinaId)) {
      toast.error('Aluno já matriculado nesta disciplina');
      return;
    }

    realizarMatricula(alunoId, disciplinaId);
    toast.success(`${aluno?.nome} matriculado em ${disciplina?.nome}`);
    setSelectedAluno('');
    setSelectedDisciplina('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Realizar Matrícula
          </DialogTitle>
          <DialogDescription>
            Matricule um aluno em uma disciplina
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="aluno">Aluno</Label>
            <Select value={selectedAluno} onValueChange={setSelectedAluno}>
              <SelectTrigger id="aluno">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {alunos.map(aluno => (
                  <SelectItem key={aluno.ID} value={aluno.ID.toString()}>
                    {aluno.nome} - {aluno.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disciplina">Disciplina</Label>
            <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
              <SelectTrigger id="disciplina">
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplinas.map(disciplina => (
                  <SelectItem key={disciplina.codigo} value={disciplina.codigo.toString()}>
                    {disciplina.nome} (Código: {disciplina.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleEnroll} className="w-full">
            Realizar Matrícula
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
