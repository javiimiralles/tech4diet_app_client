export class ActividadRealizada {
  constructor(
    public uid: string,
    public fecha?: Date,
    public caloriasGastadas?: number,
    public duracion?: number,
    public notas?: string,
    public idActividadFisica?: string,
    public idUsuario?: string
  ) {}
}
