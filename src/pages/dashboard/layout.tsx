{/* Sign Out Button at Bottom */}
<div className="p-4 border-t border-white/10">
  <Button 
    variant="outline" 
    className="w-full justify-start text-gray-300 hover:text-white border-blue-500/20 hover:border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-blue-500/10 transition-all duration-200 group"
    onClick={handleLogout}
  >
    <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-blue-500/20 transition-colors mr-2">
      <LogOut className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
    </div>
    <span className="font-medium">Sign out</span>
  </Button>
</div> 