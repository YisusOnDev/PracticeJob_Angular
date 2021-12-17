import { Province } from "../_models/province";

export function getCurrentProvinceIndex(provinces: Province[], id: number) {
    for (let index = 0; index < provinces.length; index++) {
      const element = provinces[index];
      console.log(element.id, id);

      if (element.id == id) {
        return index;
      }
    }
    return 0;
  }