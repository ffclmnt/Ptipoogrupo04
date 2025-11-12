import { useState } from 'react';
import { useSchool } from '../contexts/SchoolContext';
import { PessoaJuridica, ValidationError } from '../types';
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
import { Building2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  validateCNPJ, 
  validateEmail, 
  validatePhone,
  formatCNPJ,
  formatPhone
} from '../utils/validation';
import { Alert, AlertDescription } from './ui/alert';

interface AddFornecedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFornecedorDialog({ open, onOpenChange }: AddFornecedorDialogProps) {
  const { adicionarPessoaJuridica, pessoasJuridicas, verificarCNPJDuplicado } = useSchool();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cnpj: '',
    nome: '',
    ramoAtividade: '',
    banco: '',
    agencia: '',
    conta: '',
    telefone: '',
    email: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);

  const validateStep1 = (): boolean => {
    const newErrors: ValidationError[] = [];
    const highlighted: string[] = [];

    if (!formData.cnpj.trim()) {
      newErrors.push({ field: 'cnpj', message: "O campo 'CNPJ' é obrigatório" });
      highlighted.push('cnpj');
    } else if (!validateCNPJ(formData.cnpj)) {
      newErrors.push({ field: 'cnpj', message: "Formato de CNPJ inválido" });
      highlighted.push('cnpj');
    } else if (verificarCNPJDuplicado(formData.cnpj)) {
      newErrors.push({ 
        field: 'cnpj', 
        message: "Esta empresa já está cadastrada como fornecedora. Para editar informações, utilize a tela de gestão de fornecedores."
      });
      highlighted.push('cnpj');
      setErrors(newErrors);
      setHighlightedFields(highlighted);
      return false;
    }

    setErrors(newErrors);
    setHighlightedFields(highlighted);
    return newErrors.length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationError[] = [];
    const highlighted: string[] = [];

    if (!formData.nome.trim()) {
      newErrors.push({ field: 'nome', message: "O campo 'Razão Social' é obrigatório" });
      highlighted.push('nome');
    }

    if (!formData.ramoAtividade.trim()) {
      newErrors.push({ field: 'ramoAtividade', message: "O campo 'Ramo de Atividade' é obrigatório" });
      highlighted.push('ramoAtividade');
    }

    if (!formData.banco.trim()) {
      newErrors.push({ field: 'banco', message: "O campo 'Banco' é obrigatório" });
      highlighted.push('banco');
    }

    if (!formData.agencia.trim()) {
      newErrors.push({ field: 'agencia', message: "O campo 'Agência' é obrigatório" });
      highlighted.push('agencia');
    }

    if (!formData.conta.trim()) {
      newErrors.push({ field: 'conta', message: "O campo 'Conta' é obrigatório" });
      highlighted.push('conta');
    }

    // Validate banking data format
    if (formData.banco && formData.agencia && formData.conta) {
      const agenciaRegex = /^\d{4}(-\d)?$/;
      const contaRegex = /^\d{5,}-\d$/;
      
      if (!agenciaRegex.test(formData.agencia)) {
        newErrors.push({ field: 'agencia', message: "Dados bancários inválidos. Verifique as informações." });
        highlighted.push('agencia');
      }
      
      if (!contaRegex.test(formData.conta)) {
        newErrors.push({ field: 'conta', message: "Dados bancários inválidos. Verifique as informações." });
        highlighted.push('conta');
      }
    }

    if (!formData.telefone.trim()) {
      newErrors.push({ field: 'telefone', message: "O campo 'Telefone de Contato' é obrigatório" });
      highlighted.push('telefone');
    } else if (!validatePhone(formData.telefone)) {
      newErrors.push({ field: 'telefone', message: "Formato de telefone inválido" });
      highlighted.push('telefone');
    }

    if (!formData.email.trim()) {
      newErrors.push({ field: 'email', message: "O campo 'E-mail de Contato' é obrigatório" });
      highlighted.push('email');
    } else if (!validateEmail(formData.email)) {
      newErrors.push({ field: 'email', message: "Formato de e-mail inválido" });
      highlighted.push('email');
    }

    setErrors(newErrors);
    setHighlightedFields(highlighted);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      toast.error('Por favor, corrija os erros no formulário');
    }
  };

  const handleSubmit = () => {
    if (!validateStep2()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    const newId = Math.max(...pessoasJuridicas.map(p => p.ID), 0) + 1;

    const newFornecedor: PessoaJuridica = {
      ID: newId,
      nome: formData.nome,
      cnpj: formatCNPJ(formData.cnpj),
      telefone: formatPhone(formData.telefone),
      email: formData.email,
      ramoAtividade: formData.ramoAtividade,
      dadosBancarios: {
        banco: formData.banco,
        agencia: formData.agencia,
        conta: formData.conta,
      },
      endereco: {
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        cep: '',
      },
      contratos: [],
    };

    adicionarPessoaJuridica(newFornecedor);
    toast.success('Fornecedor cadastrado com sucesso!');

    // Reset form
    setFormData({
      cnpj: '',
      nome: '',
      ramoAtividade: '',
      banco: '',
      agencia: '',
      conta: '',
      telefone: '',
      email: '',
    });
    setErrors([]);
    setHighlightedFields([]);
    setStep(1);
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      cnpj: '',
      nome: '',
      ramoAtividade: '',
      banco: '',
      agencia: '',
      conta: '',
      telefone: '',
      email: '',
    });
    setErrors([]);
    setHighlightedFields([]);
    setStep(1);
    onOpenChange(false);
  };

  const isFieldHighlighted = (field: string) => highlightedFields.includes(field);
  const getFieldError = (field: string) => errors.find(e => e.field === field)?.message;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[900px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Cadastrar Fornecedor - Passo {step} de 2
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Informe o CNPJ da empresa' : 'Preencha os dados adicionais do fornecedor'}
          </DialogDescription>
        </DialogHeader>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p>Foram encontrados erros no formulário:</p>
              <ul className="list-disc list-inside mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 mt-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  className={isFieldHighlighted('cnpj') ? 'border-red-500' : ''}
                />
                {getFieldError('cnpj') && (
                  <p className="text-sm text-red-500">{getFieldError('cnpj')}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleNext} className="flex-1">
                  Próximo
                </Button>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Razão Social *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome da empresa"
                    className={isFieldHighlighted('nome') ? 'border-red-500' : ''}
                  />
                  {getFieldError('nome') && (
                    <p className="text-sm text-red-500">{getFieldError('nome')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ramoAtividade">Ramo de Atividade *</Label>
                  <Input
                    id="ramoAtividade"
                    value={formData.ramoAtividade}
                    onChange={(e) => setFormData({ ...formData, ramoAtividade: e.target.value })}
                    placeholder="Ex: Prestação de Serviços, Comércio, etc."
                    className={isFieldHighlighted('ramoAtividade') ? 'border-red-500' : ''}
                  />
                  {getFieldError('ramoAtividade') && (
                    <p className="text-sm text-red-500">{getFieldError('ramoAtividade')}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3">Dados Bancários para Pagamento</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco *</Label>
                      <Input
                        id="banco"
                        value={formData.banco}
                        onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                        placeholder="000"
                        className={isFieldHighlighted('banco') ? 'border-red-500' : ''}
                      />
                      {getFieldError('banco') && (
                        <p className="text-sm text-red-500">{getFieldError('banco')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência *</Label>
                      <Input
                        id="agencia"
                        value={formData.agencia}
                        onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                        placeholder="0000"
                        className={isFieldHighlighted('agencia') ? 'border-red-500' : ''}
                      />
                      {getFieldError('agencia') && (
                        <p className="text-sm text-red-500">{getFieldError('agencia')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta *</Label>
                      <Input
                        id="conta"
                        value={formData.conta}
                        onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                        placeholder="00000-0"
                        className={isFieldHighlighted('conta') ? 'border-red-500' : ''}
                      />
                      {getFieldError('conta') && (
                        <p className="text-sm text-red-500">{getFieldError('conta')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3">Contato</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone de Contato *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className={isFieldHighlighted('telefone') ? 'border-red-500' : ''}
                      />
                      {getFieldError('telefone') && (
                        <p className="text-sm text-red-500">{getFieldError('telefone')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail de Contato *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contato@empresa.com"
                        className={isFieldHighlighted('email') ? 'border-red-500' : ''}
                      />
                      {getFieldError('email') && (
                        <p className="text-sm text-red-500">{getFieldError('email')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Sair
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}