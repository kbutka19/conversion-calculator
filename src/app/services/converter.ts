/**
 * @author Alessandro Avolio (including spelling mistakes in English).
 * All ideas here are an evolution of solutions designed by GiuDiCo's team for their project.
 */


export abstract class BaseConverter<M, D> {
  constructor() {}

  public abstract convertToModel(dto: D): M;

  public abstract convertToDto(model: M): D;

  public convertToModelList(dtoArray: D[]): M[] | null {
    if (!dtoArray || !Array.isArray(dtoArray)) {
      return null;
    }
    let array: M[] = [];
    dtoArray.forEach((dto) => {
      if (dto != null && dto !== undefined) {
        array.push(this.convertToModel(dto));
      }
    });
    return array;
  }

  public convertToDtoList(modelArray: M[], light?: boolean): D[] | null {
    if (!modelArray) {
      return null;
    }
    let array: any = [];
    for (let model of modelArray) {
      if (model != null && model !== undefined) {
        if (light) {
          array.push({ id: model });
        } else {
          array.push(this.convertToDto(model));
        }
      }
    }

    return array;
  }
}
