import { SessionManager } from "@/features/session/SessionManager";
import { ScreenRouter } from "@/features/session/ScreenRouter";

export default function KioskPage() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-black">
      <SessionManager>
        <ScreenRouter />
      </SessionManager>
    </main>
  );
}
