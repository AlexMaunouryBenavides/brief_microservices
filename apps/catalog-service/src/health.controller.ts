import { Controller, Get, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";

@Controller("internal")
export class HealthController implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  // 🎨 couleurs console
  private color = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    purple: "\x1b[35m",
    bold: "\x1b[1m",
  };

  // 🧠 nom service lisible
  private getServiceName() {
    const raw = process.env.HOSTNAME || "unknown-service";

    const map: Record<string, string> = {
      "ev-catalog-service": "catalog-service",
      "ev-user-service": "user-service",
      "ev-cart-service": "cart-service",
      "ev-order-service": "order-service",
      "ev-api-gateway": "api-gateway",
    };

    for (const key of Object.keys(map)) {
      if (raw.includes(key)) return map[key];
    }

    if (raw.length >= 12) return `catalog-service (${raw.slice(0, 12)})`;

    return raw;
  }

  async onModuleInit() {
    const report = await this.getReport();
    this.prettyLog(report);
  }

  @Get("health")
  async health() {
    return this.getReport();
  }

  // 🧠 coeur diagnostic
  private async getReport() {
    const report: any = {
      service: this.getServiceName(),
      port: process.env.PORT,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {},
    };

    try {
      // ping DB
      await this.dataSource.query("SELECT 1");

      const dbName = await this.dataSource.query("SELECT DATABASE() as db");
      const user = await this.dataSource.query("SELECT USER() as user");
      const port = await this.dataSource.query("SHOW VARIABLES LIKE 'port'");
      const tables = await this.dataSource.query("SHOW TABLES");

      // 👇 catalog preview (produits)
      let productsPreview: any = [];

      try {
        // adapte si ta table s'appelle différemment (product / products)
        productsPreview = await this.dataSource.query(
          "SELECT * FROM products LIMIT 5"
        );
      } catch {
        productsPreview = [];
      }

      report.database = {
        status: "UP",
        name: dbName[0]?.db,
        user: user[0]?.user,
        port: port[0]?.Value,
        tablesCount: tables.length,
        tables: tables.map((t: any) => Object.values(t)[0]),

        // 👇 catalog data debug
        productsPreview,
      };
    } catch (err: any) {
      report.database = {
        status: "DOWN",
        error: err.message,
      };
    }

    return report;
  }

  // 🌈 logs docker
  private prettyLog(report: any) {
    const c = this.color;

    console.log(`\n${c.bold}${c.blue}🚀 CATALOG SERVICE STARTED${c.reset}`);
    console.log(`${c.cyan}Service:${c.reset} ${report.service}`);
    console.log(`${c.cyan}Port:${c.reset} ${report.port}`);

    if (report.database.status === "UP") {
      console.log(`${c.green}🟢 MySQL CONNECTED${c.reset}`);
      console.log(`${c.yellow}📁 DB:${c.reset} ${report.database.name}`);
      console.log(
        `${c.purple}👤 User:${c.reset} ${report.database.user}:${report.database.port}`
      );

      console.log(`${c.cyan}📦 Tables (${report.database.tablesCount})${c.reset}`);
      console.table(report.database.tables);

      console.log(`${c.cyan}🛍️ Products preview:${c.reset}`);
      console.table(report.database.productsPreview);
    } else {
      console.log(`${c.red}❌ DB DOWN:${c.reset} ${report.database.error}`);
    }

    console.log("\n");
  }
}