export class Usuario {
  constructor(
    public uid: string,
    public nombre?: string,
    public email?: string,
    public password?: string,
    public sexo?: string,
    public altura?: number,
    public edad?: number,
    public pesoInicial?: number,
    public pesoObjetivo?: number,
    public pesoActual?: number,
    public pesoHistorico?: {
      pesoMedio?: number,
      pesoMaximo?: number,
      pesoMinimo?: number
    },
    public plan?: {
      tipo?: string,
      nivelActividad?: string,
      caloriasDiarias?: number,
      carbosDiarios?: number,
      proteinasDiarias?: number,
      grasasDiarias?: number
    },
    public distribucionComidas?: string[],
    public configuracion?: {
      tema?: string
    }
  ){}
}
