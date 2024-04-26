export class ActividadFisica {
  constructor(
    public uid: string,
    public nombre?: string,
    public calorias?: number,
    public tiempoReferencia?: number,
    public predeterminada?: boolean,
    public idUsuario?: string
  ) {}
}
