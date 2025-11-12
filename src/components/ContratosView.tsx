import { useSchool } from '../contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, FileText, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ContratosViewProps {
  onAddFornecedor: () => void;
  onDeleteFornecedor: (id: number) => void;
}

export function ContratosView({ onAddFornecedor, onDeleteFornecedor }: ContratosViewProps) {
  const { pessoasJuridicas } = useSchool();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            Pessoas Jurídicas e Contratos
          </h2>
          <p className="text-muted-foreground">
            Visualize empresas parceiras e seus contratos vigentes
          </p>
        </div>
        <button 
          onClick={onAddFornecedor}
          className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Building2 className="h-4 w-4" />
          Cadastrar Fornecedor
        </button>
      </div>

      <div className="grid gap-6 grid-cols-3">
        {pessoasJuridicas.map(pj => (
          <Card key={pj.ID} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="break-words flex-1 min-w-0">{pj.nome}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteFornecedor(pj.ID)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-2 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <p className="break-all">{pj.cnpj}</p>
                </div>
                {pj.ramoAtividade && (
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Ramo</p>
                    <p className="truncate">{pj.ramoAtividade}</p>
                  </div>
                )}
                {pj.telefone && (
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p>{pj.telefone}</p>
                  </div>
                )}
                {pj.email && (
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="truncate">{pj.email}</p>
                  </div>
                )}
              </div>
              
              {pj.dadosBancarios && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground mb-1">Dados Bancários</p>
                  <p className="text-sm">
                    Banco {pj.dadosBancarios.banco} | 
                    Ag. {pj.dadosBancarios.agencia} | 
                    Conta {pj.dadosBancarios.conta}
                  </p>
                </div>
              )}

              {(pj.endereco.rua || pj.endereco.cep) && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                  {pj.endereco.rua && (
                    <p className="text-sm">
                      {pj.endereco.rua}, {pj.endereco.numero} - {pj.endereco.cidade}/{pj.endereco.estado}
                    </p>
                  )}
                  {pj.endereco.cep && (
                    <p className="text-sm">CEP: {pj.endereco.cep}</p>
                  )}
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  <span>Contratos ({pj.contratos.length})</span>
                </div>
                {pj.contratos.length > 0 ? (
                  <div className="space-y-3">
                    {pj.contratos.map(contrato => (
                      <div
                        key={contrato.ID}
                        className="border rounded-lg p-3 bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm">{contrato.texto}</p>
                          </div>
                          <Badge variant="secondary">ID: {contrato.ID}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum contrato registrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {pessoasJuridicas.length === 0 && (
          <Card className="col-span-3">
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma pessoa jurídica cadastrada. Clique em "Cadastrar Fornecedor" para começar.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}