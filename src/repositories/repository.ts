import { DataSource } from "typeorm";

interface RepositoryI {
  dataSource: DataSource;
}

class Repository implements RepositoryI {
  dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
}

export { Repository };
