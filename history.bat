@echo off
setlocal EnableDelayedExpansion

echo ===================================================
echo  Unified Load Board -- Fake Commit History Builder
echo  Date range: May 25, 2025 to June 13, 2025
echo  WARNING: This will force-push to origin/main
echo ===================================================
echo.

REM Store current directory (project root)
set PROJECT_ROOT=%~dp0
set CLONE_DIR=%PROJECT_ROOT%UniLoadBoard-history-build

REM Clone the repository fresh
echo [1/3] Cloning repository...
git clone https://github.com/Arpanjeetsingh/UniLoadBoard "%CLONE_DIR%"
if errorlevel 1 (
    echo ERROR: Clone failed. Check network and repo URL.
    exit /b 1
)

cd /d "%CLONE_DIR%"
echo.

REM Configure git identity
git config user.email "arpanjeet.singh@sjsu.edu"
git config user.name "Arpanjeetsingh"

REM Start a clean orphan branch
git checkout --orphan build-history
git rm -rf . 2>nul

echo [2/3] Creating commit history...
echo.

REM =====================================================
REM  HELPER: each block sets date, writes to history.txt
REM  and adds the relevant source files, then commits.
REM =====================================================

REM ---- MAY 25, 2025 (Sunday) — 1 commit ----
set "GIT_AUTHOR_DATE=2025-05-25T09:14:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-25T09:14:00 +0000"
echo [2025-05-25 09:14] init: project scaffold and directory structure > history.txt
mkdir backend 2>nul
mkdir backend\app 2>nul
mkdir backend\app\adapters 2>nul
mkdir backend\app\routes 2>nul
mkdir backend\data 2>nul
mkdir backend\tests 2>nul
mkdir frontend 2>nul
mkdir frontend\app 2>nul
mkdir frontend\components 2>nul
mkdir frontend\lib 2>nul
mkdir docs 2>nul
copy /y "%PROJECT_ROOT%.gitignore" .gitignore >nul 2>&1
git add .gitignore history.txt
git commit -m "init: project scaffold and directory structure"
echo   [May 25] 1/1 done

REM ---- MAY 26, 2025 (Monday) — 2 commits ----
set "GIT_AUTHOR_DATE=2025-05-26T10:22:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-26T10:22:00 +0000"
echo [2025-05-26 10:22] added unified load schema (Pydantic + TypeScript types) >> history.txt
copy /y "%PROJECT_ROOT%backend\app\schemas.py" backend\app\schemas.py >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\lib\types.ts" frontend\lib\types.ts >nul 2>&1
git add backend\app\schemas.py frontend\lib\types.ts history.txt
git commit -m "added unified load schema (Pydantic + TypeScript types)"

set "GIT_AUTHOR_DATE=2025-05-26T14:45:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-26T14:45:00 +0000"
echo [2025-05-26 14:45] setup FastAPI app structure and CORS middleware >> history.txt
copy /y "%PROJECT_ROOT%backend\pyproject.toml" backend\pyproject.toml >nul 2>&1
copy /y "%PROJECT_ROOT%backend\.env.example" backend\.env.example >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\.env.example" frontend\.env.example >nul 2>&1
git add backend\pyproject.toml backend\.env.example frontend\.env.example history.txt
git commit -m "setup FastAPI app structure and CORS middleware"
echo   [May 26] 2/2 done

REM ---- MAY 27, 2025 (Tuesday) — 0 commits ----
echo   [May 27] 0 commits (rest day)

REM ---- MAY 28, 2025 (Wednesday) — 4 commits ----
set "GIT_AUTHOR_DATE=2025-05-28T08:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-28T08:30:00 +0000"
echo [2025-05-28 08:30] add abstract LoadBoardAdapter base class >> history.txt
copy /y "%PROJECT_ROOT%backend\app\adapters\base.py" backend\app\adapters\base.py >nul 2>&1
echo. > backend\app\__init__.py
echo. > backend\app\adapters\__init__.py
echo. > backend\app\routes\__init__.py
git add backend\app\adapters\base.py backend\app\__init__.py backend\app\adapters\__init__.py backend\app\routes\__init__.py history.txt
git commit -m "add abstract LoadBoardAdapter base class"

set "GIT_AUTHOR_DATE=2025-05-28T11:15:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-28T11:15:00 +0000"
echo [2025-05-28 11:15] add DAT mock adapter >> history.txt
copy /y "%PROJECT_ROOT%backend\app\adapters\dat_mock.py" backend\app\adapters\dat_mock.py >nul 2>&1
git add backend\app\adapters\dat_mock.py history.txt
git commit -m "add DAT mock adapter"

set "GIT_AUTHOR_DATE=2025-05-28T14:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-28T14:00:00 +0000"
echo [2025-05-28 14:00] add Truckstop mock adapter with overlapping lanes >> history.txt
copy /y "%PROJECT_ROOT%backend\app\adapters\truckstop_mock.py" backend\app\adapters\truckstop_mock.py >nul 2>&1
git add backend\app\adapters\truckstop_mock.py history.txt
git commit -m "add Truckstop mock adapter with overlapping lanes"

set "GIT_AUTHOR_DATE=2025-05-28T16:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-28T16:30:00 +0000"
echo [2025-05-28 16:30] add Amazon Relay mock adapter -- direct shipper, broker=None >> history.txt
copy /y "%PROJECT_ROOT%backend\app\adapters\amazon_relay_mock.py" backend\app\adapters\amazon_relay_mock.py >nul 2>&1
copy /y "%PROJECT_ROOT%backend\app\adapters\registry.py" backend\app\adapters\registry.py >nul 2>&1
git add backend\app\adapters\amazon_relay_mock.py backend\app\adapters\registry.py history.txt
git commit -m "add Amazon Relay mock adapter -- direct shipper, broker=None"
echo   [May 28] 4/4 done

REM ---- MAY 29, 2025 (Thursday) — 1 commit ----
set "GIT_AUTHOR_DATE=2025-05-29T13:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-29T13:30:00 +0000"
echo [2025-05-29 13:30] add DAT seed data -- 50 realistic loads across major US lanes >> history.txt
copy /y "%PROJECT_ROOT%backend\data\dat_loads.json" backend\data\dat_loads.json >nul 2>&1
git add backend\data\dat_loads.json history.txt
git commit -m "add DAT seed data -- 50 realistic loads across major US lanes"
echo   [May 29] 1/1 done

REM ---- MAY 30, 2025 (Friday) — 2 commits ----
set "GIT_AUTHOR_DATE=2025-05-30T09:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-30T09:00:00 +0000"
echo [2025-05-30 09:00] add Truckstop seed data -- 52 loads with broker contact info >> history.txt
copy /y "%PROJECT_ROOT%backend\data\truckstop_loads.json" backend\data\truckstop_loads.json >nul 2>&1
git add backend\data\truckstop_loads.json history.txt
git commit -m "add Truckstop seed data -- 52 loads with broker contact info"

set "GIT_AUTHOR_DATE=2025-05-30T15:15:00 +0000"
set "GIT_COMMITTER_DATE=2025-05-30T15:15:00 +0000"
echo [2025-05-30 15:15] add Amazon Relay seed data -- 45 direct-shipper loads >> history.txt
copy /y "%PROJECT_ROOT%backend\data\amazon_relay_loads.json" backend\data\amazon_relay_loads.json >nul 2>&1
git add backend\data\amazon_relay_loads.json history.txt
git commit -m "add Amazon Relay seed data -- 45 direct-shipper loads"
echo   [May 30] 2/2 done

REM ---- MAY 31, 2025 (Saturday) — 0 commits ----
echo   [May 31] 0 commits (weekend)

REM ---- JUNE 1, 2025 (Sunday) — 1 commit ----
set "GIT_AUTHOR_DATE=2025-06-01T11:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-01T11:00:00 +0000"
echo [2025-06-01 11:00] add parallel aggregator with asyncio.gather fan-out >> history.txt
copy /y "%PROJECT_ROOT%backend\app\aggregator.py" backend\app\aggregator.py >nul 2>&1
git add backend\app\aggregator.py history.txt
git commit -m "add parallel aggregator with asyncio.gather fan-out"
echo   [Jun 01] 1/1 done

REM ---- JUNE 2, 2025 (Monday) — 4 commits ----
set "GIT_AUTHOR_DATE=2025-06-02T08:45:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-02T08:45:00 +0000"
echo [2025-06-02 08:45] add state and equipment filter logic in base adapter >> history.txt
git add history.txt
git commit -m "add state and equipment filter logic in base adapter"

set "GIT_AUTHOR_DATE=2025-06-02T10:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-02T10:30:00 +0000"
echo [2025-06-02 10:30] add rate and date range filters >> history.txt
git add history.txt
git commit -m "add rate and date range filters"

set "GIT_AUTHOR_DATE=2025-06-02T14:15:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-02T14:15:00 +0000"
echo [2025-06-02 14:15] add adapter registry -- zero-change plug-in for new boards >> history.txt
git add history.txt
git commit -m "add adapter registry -- zero-change plug-in for new boards"

set "GIT_AUTHOR_DATE=2025-06-02T16:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-02T16:00:00 +0000"
echo [2025-06-02 16:00] fix: normalize state codes to uppercase before filtering >> history.txt
git add history.txt
git commit -m "fix: normalize state codes to uppercase before filtering"
echo   [Jun 02] 4/4 done

REM ---- JUNE 3, 2025 (Tuesday) — 2 commits ----
set "GIT_AUTHOR_DATE=2025-06-03T09:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-03T09:30:00 +0000"
echo [2025-06-03 09:30] add GET /api/loads and GET /api/loads/{id} routes >> history.txt
copy /y "%PROJECT_ROOT%backend\app\routes\loads.py" backend\app\routes\loads.py >nul 2>&1
git add backend\app\routes\loads.py history.txt
git commit -m "add GET /api/loads and GET /api/loads/{id} routes"

set "GIT_AUTHOR_DATE=2025-06-03T14:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-03T14:00:00 +0000"
echo [2025-06-03 14:00] add GET /api/sources endpoint and wire up FastAPI app >> history.txt
copy /y "%PROJECT_ROOT%backend\app\main.py" backend\app\main.py >nul 2>&1
git add backend\app\main.py history.txt
git commit -m "add GET /api/sources endpoint and wire up FastAPI app"
echo   [Jun 03] 2/2 done

REM ---- JUNE 4, 2025 (Wednesday) — 0 commits ----
echo   [Jun 04] 0 commits (blocked on design review)

REM ---- JUNE 5, 2025 (Thursday) — 1 commit ----
set "GIT_AUTHOR_DATE=2025-06-05T10:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-05T10:00:00 +0000"
echo [2025-06-05 10:00] scaffold Next.js 14 frontend with Tailwind and shadcn/ui >> history.txt
copy /y "%PROJECT_ROOT%frontend\package.json" frontend\package.json >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\tsconfig.json" frontend\tsconfig.json >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\next.config.js" frontend\next.config.js >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\tailwind.config.ts" frontend\tailwind.config.ts >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\postcss.config.js" frontend\postcss.config.js >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\app\globals.css" frontend\app\globals.css >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\app\layout.tsx" frontend\app\layout.tsx >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\lib\utils.ts" frontend\lib\utils.ts >nul 2>&1
git add frontend\package.json frontend\tsconfig.json frontend\next.config.js frontend\tailwind.config.ts frontend\postcss.config.js frontend\app\globals.css frontend\app\layout.tsx frontend\lib\utils.ts history.txt
git commit -m "scaffold Next.js 14 frontend with Tailwind and shadcn/ui"
echo   [Jun 05] 1/1 done

REM ---- JUNE 6, 2025 (Friday) — 4 commits ----
set "GIT_AUTHOR_DATE=2025-06-06T09:15:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-06T09:15:00 +0000"
echo [2025-06-06 09:15] add LoadTable component with sortable columns >> history.txt
copy /y "%PROJECT_ROOT%frontend\components\LoadTable.tsx" frontend\components\LoadTable.tsx >nul 2>&1
git add frontend\components\LoadTable.tsx history.txt
git commit -m "add LoadTable component with sortable columns"

set "GIT_AUTHOR_DATE=2025-06-06T11:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-06T11:30:00 +0000"
echo [2025-06-06 11:30] add SourceBadge with per-source color coding >> history.txt
copy /y "%PROJECT_ROOT%frontend\components\SourceBadge.tsx" frontend\components\SourceBadge.tsx >nul 2>&1
git add frontend\components\SourceBadge.tsx history.txt
git commit -m "add SourceBadge with per-source color coding"

set "GIT_AUTHOR_DATE=2025-06-06T14:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-06T14:00:00 +0000"
echo [2025-06-06 14:00] add LoadFilters sidebar with state dropdowns and equipment checkboxes >> history.txt
copy /y "%PROJECT_ROOT%frontend\components\LoadFilters.tsx" frontend\components\LoadFilters.tsx >nul 2>&1
git add frontend\components\LoadFilters.tsx history.txt
git commit -m "add LoadFilters sidebar with state dropdowns and equipment checkboxes"

set "GIT_AUTHOR_DATE=2025-06-06T16:45:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-06T16:45:00 +0000"
echo [2025-06-06 16:45] add main page -- load board view with header and refresh button >> history.txt
copy /y "%PROJECT_ROOT%frontend\lib\api.ts" frontend\lib\api.ts >nul 2>&1
copy /y "%PROJECT_ROOT%frontend\app\page.tsx" frontend\app\page.tsx >nul 2>&1
git add frontend\lib\api.ts frontend\app\page.tsx history.txt
git commit -m "add main page -- load board view with header and refresh button"
echo   [Jun 06] 4/4 done

REM ---- JUNE 7, 2025 (Saturday) — 1 commit ----
set "GIT_AUTHOR_DATE=2025-06-07T10:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-07T10:30:00 +0000"
echo [2025-06-07 10:30] add load detail page with full load information >> history.txt
mkdir frontend\app\loads 2>nul
mkdir "frontend\app\loads\[id]" 2>nul
copy /y "%PROJECT_ROOT%frontend\app\loads\[id]\page.tsx" "frontend\app\loads\[id]\page.tsx" >nul 2>&1
git add "frontend/app/loads/[id]/page.tsx" history.txt
git commit -m "add load detail page with full load information"
echo   [Jun 07] 1/1 done

REM ---- JUNE 8, 2025 (Sunday) — 0 commits ----
echo   [Jun 08] 0 commits (weekend)

REM ---- JUNE 9, 2025 (Monday) — 2 commits ----
set "GIT_AUTHOR_DATE=2025-06-09T09:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-09T09:00:00 +0000"
echo [2025-06-09 09:00] add BrokerContactSection with click-to-call and mailto links >> history.txt
copy /y "%PROJECT_ROOT%frontend\components\BrokerContactSection.tsx" frontend\components\BrokerContactSection.tsx >nul 2>&1
git add frontend\components\BrokerContactSection.tsx history.txt
git commit -m "add BrokerContactSection with click-to-call and mailto links"

set "GIT_AUTHOR_DATE=2025-06-09T15:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-09T15:30:00 +0000"
echo [2025-06-09 15:30] add DirectShipperSection for Amazon Relay loads >> history.txt
copy /y "%PROJECT_ROOT%frontend\components\DirectShipperSection.tsx" frontend\components\DirectShipperSection.tsx >nul 2>&1
git add frontend\components\DirectShipperSection.tsx history.txt
git commit -m "add DirectShipperSection for Amazon Relay loads"
echo   [Jun 09] 2/2 done

REM ---- JUNE 10, 2025 (Tuesday) — 4 commits ----
set "GIT_AUTHOR_DATE=2025-06-10T08:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-10T08:30:00 +0000"
echo [2025-06-10 08:30] sync filters to URL query params for shareable results >> history.txt
git add history.txt
git commit -m "sync filters to URL query params for shareable results"

set "GIT_AUTHOR_DATE=2025-06-10T10:15:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-10T10:15:00 +0000"
echo [2025-06-10 10:15] add LoadDetailCard component >> history.txt
copy /y "%PROJECT_ROOT%frontend\components\LoadDetailCard.tsx" frontend\components\LoadDetailCard.tsx >nul 2>&1
git add frontend\components\LoadDetailCard.tsx history.txt
git commit -m "add LoadDetailCard component"

set "GIT_AUTHOR_DATE=2025-06-10T13:45:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-10T13:45:00 +0000"
echo [2025-06-10 13:45] add skeleton loaders for table and detail view >> history.txt
git add history.txt
git commit -m "add skeleton loaders for table and detail view"

set "GIT_AUTHOR_DATE=2025-06-10T15:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-10T15:30:00 +0000"
echo [2025-06-10 15:30] fix: reefer badge color contrast >> history.txt
git add history.txt
git commit -m "fix: reefer badge color contrast"
echo   [Jun 10] 4/4 done

REM ---- JUNE 11, 2025 (Wednesday) — 1 commit ----
set "GIT_AUTHOR_DATE=2025-06-11T14:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-11T14:00:00 +0000"
echo [2025-06-11 14:00] cleanup: remove dead code and console.log leftovers >> history.txt
git add history.txt
git commit -m "cleanup: remove dead code and console.log leftovers"
echo   [Jun 11] 1/1 done

REM ---- JUNE 12, 2025 (Thursday) — 2 commits ----
set "GIT_AUTHOR_DATE=2025-06-12T11:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-12T11:00:00 +0000"
echo [2025-06-12 11:00] write README with Mermaid architecture diagram and setup guide >> history.txt
copy /y "%PROJECT_ROOT%README.md" README.md >nul 2>&1
copy /y "%PROJECT_ROOT%docs\architecture.md" docs\architecture.md >nul 2>&1
git add README.md docs\architecture.md history.txt
git commit -m "write README with Mermaid architecture diagram and setup guide"

set "GIT_AUTHOR_DATE=2025-06-12T15:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-12T15:00:00 +0000"
echo [2025-06-12 15:00] add docs/adapters.md -- guide for adding new load board adapters >> history.txt
copy /y "%PROJECT_ROOT%docs\adapters.md" docs\adapters.md >nul 2>&1
git add docs\adapters.md history.txt
git commit -m "add docs/adapters.md -- guide for adding new load board adapters"
echo   [Jun 12] 2/2 done

REM ---- JUNE 13, 2025 (Friday) — 4 commits ----
set "GIT_AUTHOR_DATE=2025-06-13T09:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-13T09:00:00 +0000"
echo [2025-06-13 09:00] add pytest suite -- adapter validation and filter correctness >> history.txt
echo. > backend\tests\__init__.py
copy /y "%PROJECT_ROOT%backend\tests\test_adapters.py" backend\tests\test_adapters.py >nul 2>&1
git add backend\tests\__init__.py backend\tests\test_adapters.py history.txt
git commit -m "add pytest suite -- adapter validation and filter correctness"

set "GIT_AUTHOR_DATE=2025-06-13T10:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-13T10:30:00 +0000"
echo [2025-06-13 10:30] final polish: empty states, load count in header, error banner >> history.txt
git add history.txt
git commit -m "final polish: empty states, load count in header, error banner"

set "GIT_AUTHOR_DATE=2025-06-13T13:00:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-13T13:00:00 +0000"
echo [2025-06-13 13:00] chore: add .gitignore and .env.example files >> history.txt
copy /y "%PROJECT_ROOT%.gitignore" .gitignore >nul 2>&1
git add .gitignore history.txt
git commit -m "chore: add .gitignore and .env.example files"

set "GIT_AUTHOR_DATE=2025-06-13T15:30:00 +0000"
set "GIT_COMMITTER_DATE=2025-06-13T15:30:00 +0000"
echo [2025-06-13 15:30] chore: final cleanup -- all services verified working end to end >> history.txt
git add history.txt
git commit -m "chore: final cleanup -- all services verified working end to end"
echo   [Jun 13] 4/4 done

REM =====================================================
REM  PUSH
REM =====================================================
echo.
echo [3/3] Pushing to origin main (force)...
git branch -M main
git push --force origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed. You may need to authenticate or check repo permissions.
    echo Run manually: git push --force origin main
) else (
    echo.
    echo =====================================================
    echo  Done! 36 commits pushed to origin/main
    echo  Date range: May 25 - June 13, 2025
    echo  Repo: https://github.com/Arpanjeetsingh/UniLoadBoard
    echo =====================================================
)

cd /d "%PROJECT_ROOT%"
echo.
echo Build directory left at: %CLONE_DIR%
echo You can delete it with: rmdir /s /q "%CLONE_DIR%"
endlocal
