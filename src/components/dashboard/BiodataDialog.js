import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { colors } from '@/styles/colors'

export default function BiodataDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center', color: colors.primary.main }}>
        Profil Bendahara COCONUT Computer Club
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <img src="image copy.png" alt="Profile" style={{ width: 250, borderRadius: '50%' }} />
        <Typography variant="h6" fontWeight={600} mt={2}>
          Nama Bendahara: Syahrul Ramadhan
        </Typography>
        <Typography variant="body1" color={colors.text.secondary}>
          Jabatan: Bendahara Umum
        </Typography>
        <Typography variant="body1" color={colors.text.secondary}>
          Email: bendahara@coconut.or.id
        </Typography>
        <Typography variant="body1" color={colors.text.secondary}>
          Pengalaman: Mengelola keuangan organisasi, event, dan sponsorship IT
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="contained" onClick={onClose} sx={{ backgroundColor: colors.primary.main }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}