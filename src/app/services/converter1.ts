import { BaseConverter } from './converter';
export interface DatiFasiModel {
  m: string;
}
export interface DatiFasiBeneficiariDTO {}

export class DatiFasiConverter {
  // private vistoConverter = new VistoConverter();

  convertToDto(model: DatiFasiModel): DatiFasiBeneficiariDTO | undefined {
    if (!model) {
      return undefined;
    }
    return {
      // listaVistiAmministrativi: this.vistoConverter.convertToDtoList(model.visti),
      // ulterioreMessaggio: model.ulterioreMessaggio
    };
  }

  convertToModel(dto: DatiFasiBeneficiariDTO): DatiFasiModel | undefined {
    if (!dto) {
      return undefined;
    }
    return {
      m: 'kejsi',
      // Math.random() * 1000 + '',
      // convertDtoToDateModel(dto.dataDecesso),
      // !!dto.esitoFaseEsitoMortale ? new Tipologica(dto.esitoFaseEsitoMortale.id, dto.esitoFaseEsitoMortale.valore) : undefined,
      // !!dto.esitoFaseSuperstitiEdEredi ? new Tipologica(dto.esitoFaseSuperstitiEdEredi.id, dto.esitoFaseSuperstitiEdEredi.valore) : undefined,
    };
  }
}
