declare namespace IGeneral {
  type UnixTimestamp = number;
  interface IIdParam {
    id: string;
  }

  interface IPagination {
    page?: number;
    limit?: number;
  }
}

export { IGeneral };
