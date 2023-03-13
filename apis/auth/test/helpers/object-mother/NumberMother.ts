type NumberOptions = {
  max?: number;
  min?: number;
};
export class NumberMother {
  public static random(options?: NumberOptions): number {
    const min = options?.min || 1;
    const max = options?.max || 9999;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
