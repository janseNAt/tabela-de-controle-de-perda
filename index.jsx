import { useMemo, useState } from "react";

const fmtBRL = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function TabelaControlePerda() {
  const [banca, setBanca] = useState(1000);
  const [valorInvestido, setValorInvestido] = useState(20);
  const [payout, setPayout] = useState(87);
  const [maxOperacoes, setMaxOperacoes] = useState(10);

  const pctPorOperacao = banca > 0 ? (valorInvestido / banca) * 100 : 0;
  const ganhoPorOperacao = valorInvestido * (payout / 100);

  const linhas = useMemo(() => {
    const rows = [];
    let bancaAposPerdas = banca;
    let bancaAposGanhos = banca;
    for (let n = 1; n <= maxOperacoes; n++) {
      const perdaAcumulada = valorInvestido * n;
      const ganhoAcumulado = ganhoPorOperacao * n;
      bancaAposPerdas = banca - perdaAcumulada;
      bancaAposGanhos = banca + ganhoAcumulado;
      const pctBancaPerdida = banca > 0 ? (perdaAcumulada / banca) * 100 : 0;
      rows.push({
        n,
        perdaAcumulada,
        ganhoAcumulado,
        pctBancaPerdida,
        bancaAposPerdas,
        bancaAposGanhos,
      });
    }
    return rows;
  }, [banca, valorInvestido, ganhoPorOperacao, maxOperacoes]);

  const nivelRisco =
    pctPorOperacao <= 1
      ? { label: "Conservador", color: "#22c55e" }
      : pctPorOperacao <= 3
      ? { label: "Moderado", color: "#facc15" }
      : { label: "Agressivo", color: "#ef4444" };

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        background: "#090d16",
        color: "#f8fafc",
        padding: "24px",
        borderRadius: "14px",
        maxWidth: "760px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "#38bdf8",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Gestão de Risco
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: 800, margin: "4px 0 0" }}>
          Tabela de Controle de Perda
        </h1>
      </div>

      {/* Inputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <Campo label="Banca total (R$)">
          <input
            type="number"
            value={banca}
            min={0}
            step="10"
            onChange={(e) => setBanca(Math.max(0, Number(e.target.value)))}
            style={inputStyle}
          />
        </Campo>
        <Campo label="Valor investido / operação (R$)">
          <input
            type="number"
            value={valorInvestido}
            min={0}
            step="1"
            onChange={(e) =>
              setValorInvestido(Math.max(0, Number(e.target.value)))
            }
            style={inputStyle}
          />
        </Campo>
        <Campo label="Payout (%)">
          <input
            type="number"
            value={payout}
            min={0}
            max={100}
            step="1"
            onChange={(e) => setPayout(Math.max(0, Number(e.target.value)))}
            style={inputStyle}
          />
        </Campo>
        <Campo label="Operações a simular">
          <input
            type="number"
            value={maxOperacoes}
            min={1}
            max={30}
            step="1"
            onChange={(e) =>
              setMaxOperacoes(
                Math.min(30, Math.max(1, Number(e.target.value)))
              )
            }
            style={inputStyle}
          />
        </Campo>
      </div>

      {/* Resumo por operação */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <ResumoCard
          label="Ganho por operação"
          value={fmtBRL(ganhoPorOperacao)}
          color="#22c55e"
        />
        <ResumoCard
          label="Perda por operação"
          value={fmtBRL(valorInvestido)}
          color="#ef4444"
        />
        <ResumoCard
          label="% da banca por operação"
          value={`${pctPorOperacao.toFixed(2)}%`}
          color={nivelRisco.color}
          sub={nivelRisco.label}
        />
      </div>

      {pctPorOperacao > 3 && (
        <div
          style={{
            fontSize: "12px",
            color: "#fbbf24",
            background: "rgba(245,158,11,0.1)",
            border: "1px solid #d97706",
            borderRadius: "8px",
            padding: "8px 10px",
            marginBottom: "16px",
          }}
        >
          ⚠️ Você está arriscando {pctPorOperacao.toFixed(1)}% da banca por
          operação. A maioria das estratégias de gestão de risco recomenda
          ficar entre 1% e 2% por operação — assim, uma sequência de percas
          não compromete a banca rapidamente.
        </div>
      )}

      {/* Tabela */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #1f2937" }}>
              <Th>Percas seguidas</Th>
              <Th align="right">Ganhos (se vitórias)</Th>
              <Th align="right">Perda acumulada</Th>
              <Th align="right">% da banca perdida</Th>
              <Th align="right">Banca restante</Th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((row) => {
              const alerta = row.pctBancaPerdida >= 20;
              return (
                <tr
                  key={row.n}
                  style={{
                    borderBottom: "1px solid #1f2937",
                    background: alerta
                      ? "rgba(239, 68, 68, 0.08)"
                      : "transparent",
                  }}
                >
                  <Td>{row.n}</Td>
                  <Td align="right" color="#22c55e">
                    {fmtBRL(row.ganhoAcumulado)}
                  </Td>
                  <Td align="right" color="#ef4444">
                    {fmtBRL(row.perdaAcumulada)}
                  </Td>
                  <Td
                    align="right"
                    color={alerta ? "#ef4444" : "#f8fafc"}
                    bold={alerta}
                  >
                    {row.pctBancaPerdida.toFixed(1)}%
                    {alerta ? " ⚠️" : ""}
                  </Td>
                  <Td align="right">{fmtBRL(row.bancaAposPerdas)}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: "10px", color: "#64748b", marginTop: "14px" }}>
        As linhas destacadas em vermelho marcam quando as percas seguidas já
        comeram 20% ou mais da banca — ponto comum pra definir "stop do dia" e
        parar de operar.
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontSize: "10px", color: "#94a3b8" }}>{label}</span>
      {children}
    </label>
  );
}

function ResumoCard({ label, value, color, sub }) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: "10px", color: "#94a3b8" }}>{label}</div>
      <div
        style={{
          fontSize: "17px",
          fontWeight: 800,
          color,
          fontFamily: "monospace",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "10px", color, fontWeight: 600 }}>{sub}</div>
      )}
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "6px 8px",
        color: "#94a3b8",
        fontWeight: 700,
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left", color = "#f8fafc", bold = false }) {
  return (
    <td
      style={{
        textAlign: align,
        padding: "6px 8px",
        color,
        fontWeight: bold ? 800 : 400,
        fontFamily: "monospace",
      }}
    >
      {children}
    </td>
  );
}

const inputStyle = {
  background: "#111827",
  border: "1px solid #1f2937",
  color: "#f8fafc",
  padding: "6px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  outline: "none",
  fontFamily: "monospace",
};
