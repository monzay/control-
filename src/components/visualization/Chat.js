import { AlertCircle } from "lucide-react"
function Chat() {
  return (
    <div className="flex flex-col items-center justify-center h-64 backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-8">
      <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg mb-4 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>En desarrollo</span>
      </div>
      <h3 className="text-xl font-medium text-white/80 mb-2">Sección de chats</h3>
      <p className="text-white/60 text-center">
        Esta funcionalidad estará disponible próximamente. Podrás chatear con otros usuarios sobre tus
        hábitos y metas.
      </p>
    </div>
  )
}
export default Chat