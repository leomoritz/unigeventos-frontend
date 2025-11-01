import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CustomDatePicker } from "../ui/CustomDatePicker";
import { Plus, Trash2, DollarSign, Users, Calendar, Tag, X } from "lucide-react";

export const BatchList = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "batches",
  });

  const addBatch = () => {
    append({
      name: "",
      capacity: 0,
      price: 0,
      startDate: null,
      endDate: null,
    });
  };

  // Helper para acessar erros de forma segura
  const getBatchError = (index: number, field: string) => {
    const batchErrors = errors?.batches as any;
    return batchErrors?.[index]?.[field]?.message;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-500" />
            Lotes de Pagamento
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Configure diferentes períodos e preços para o evento
          </p>
        </div>
        <Button
          type="button"
          onClick={addBatch}
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lote
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed">
          <div className="p-3 bg-orange-500/10 rounded-full w-fit mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-orange-500" />
          </div>
          <h4 className="text-slate-300 font-medium mb-2">Nenhum lote configurado</h4>
          <p className="text-slate-400 text-sm">Clique em "Adicionar Lote" para começar a configurar os preços</p>
        </div>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-6 border border-slate-700/50 rounded-xl p-6 bg-slate-800/20 hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Tag className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium text-white">
                  Lote {index + 1}
                </h4>
                <p className="text-sm text-slate-400">Configure preço e período</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
              className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Nome do Lote */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Tag className="h-4 w-4 text-orange-500" />
                Nome do Lote *
              </label>
              <Input
                placeholder="Ex: 1º Lote, Promoção..."
                {...register(`batches.${index}.name`)}
                className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-11 px-4"
              />
              {getBatchError(index, 'name') && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'name')}
                </p>
              )}
            </div>

            {/* Capacidade */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Users className="h-4 w-4 text-orange-500" />
                Capacidade *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  min="1"
                  {...register(`batches.${index}.capacity`, {
                    valueAsNumber: true,
                  })}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-11 px-4 pr-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  pessoas
                </div>
              </div>
              {getBatchError(index, 'capacity') && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'capacity')}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <DollarSign className="h-4 w-4 text-orange-500" />
                Preço *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 25.00"
                  min="0"
                  step="0.01"
                  {...register(`batches.${index}.price`, { valueAsNumber: true })}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 h-11 px-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  R$
                </div>
              </div>
              {getBatchError(index, 'price') && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'price')}
                </p>
              )}
            </div>
          </div>

          {/* Segunda linha: Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data de Início */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="h-4 w-4 text-orange-500" />
                Data de Início *
              </label>
              <CustomDatePicker
                name={`batches.${index}.startDate`}
                control={control}
                placeholder="Início do lote"
                withTime={false}
              />
              {getBatchError(index, 'startDate') && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'startDate')}
                </p>
              )}
            </div>

            {/* Data de Fim */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="h-4 w-4 text-orange-500" />
                Data de Fim *
              </label>
              <CustomDatePicker
                name={`batches.${index}.endDate`}
                control={control}
                placeholder="Fim do lote"
                withTime={false}
              />
              {getBatchError(index, 'endDate') && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                  <X className="h-3 w-3" />
                  {getBatchError(index, 'endDate')}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {fields.length > 0 && (
        <div className="text-center pt-4">
          <Button
            type="button"
            onClick={addBatch}
            variant="outline"
            className="bg-transparent border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Outro Lote
          </Button>
        </div>
      )}
    </div>
  );
};
