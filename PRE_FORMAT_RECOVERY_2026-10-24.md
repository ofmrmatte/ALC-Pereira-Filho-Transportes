# Recuperação do código — ofmrmatte/ALC-Pereira-Filho-Transportes

Backup anterior à formatação do PC, realizado em 24/10/2026.

As versões locais foram preservadas nas branches abaixo. A branch principal não foi alterada. Este backup não é uma validação de build, testes ou produção.

Arquivos de ambiente, bancos locais, credenciais, logs, evidências de navegação e saídas de compilação não fazem parte do backup de código.

| Tipo | Origem | Branch de recuperação | SHA |
|---|---|---|---|
| worktree | main | [backup/pre-format-2026-10-24/worktree-work-alc-pereira-filho-transportes-bd9d5fd0](https://github.com/ofmrmatte/ALC-Pereira-Filho-Transportes/tree/backup/pre-format-2026-10-24/worktree-work-alc-pereira-filho-transportes-bd9d5fd0) | `b6068e1e9087e7e2cc46abac80dd5108487161a2` |

## Recuperar uma versão local

```powershell
git clone https://github.com/ofmrmatte/ALC-Pereira-Filho-Transportes.git
cd ALC-Pereira-Filho-Transportes
git branch -r --list "origin/backup/pre-format-2026-10-24/*"
# Substitua BRANCH pela branch worktree/commit escolhida na tabela:
git switch -c recuperado --track "origin/BRANCH"
```

Cada branch worktree contém o código de uma cópia local. Versões diferentes foram preservadas separadamente e não foram mescladas.

## Recuperar um stash

Escolha a branch do tipo stash na tabela. Para restaurar também o estado do índice e os arquivos não rastreados que estavam no stash:

```powershell
git switch -c recuperar-stash "origin/BRANCH-DO-STASH^1"
git stash apply --index "origin/BRANCH-DO-STASH"
```

Reinstale as dependências e restaure as configurações e segredos por seus canais próprios antes de executar o projeto.
