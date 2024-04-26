export class MedidaCorporal {
  constructor(
    public uid: string,
    public nombre?: string,
    public bilateral?: boolean,
    public medida1?: number,
    public medida2?: number,
    public idUsuario?: string
  ) {}
}
