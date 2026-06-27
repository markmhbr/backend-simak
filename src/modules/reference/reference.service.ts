import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAgama() {
    return this.prisma.agama.findMany({
      select: { agama_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getBank(search?: string) {
    return this.prisma.bank.findMany({
      where: search ? { nm_bank: { contains: search, mode: 'insensitive' } } : undefined,
      select: { id_bank: true, nm_bank: true },
      orderBy: { nm_bank: 'asc' },
    });
  }

  async getJabatanPtk() {
    return this.prisma.jabatan_ptk.findMany({
      select: { jabatan_ptk_id: true, jabatan_ptk: true },
      orderBy: { jabatan_ptk: 'asc' },
    });
  }

  async getJenisPtk() {
    return this.prisma.jenis_ptk.findMany({
      select: { jenis_ptk_id: true, jenis_ptk: true },
      orderBy: { jenis_ptk: 'asc' },
    });
  }

  async getKeahlianLaboratorium() {
    return this.prisma.keahlian_laboratorium.findMany({
      select: { keahlian_laboratorium_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getMstWilayah(search?: string, limit = 50) {
    return this.prisma.mst_wilayah.findMany({
      where: search ? { nama: { contains: search, mode: 'insensitive' } } : undefined,
      select: { kode_wilayah: true, nama: true, id_level_wilayah: true },
      orderBy: { nama: 'asc' },
      take: limit,
    });
  }

  async getWilayahByParent(level: number, parentCode?: string) {
    let mst_kode_wilayah: string | undefined = parentCode ? parentCode.trim().padEnd(8, ' ') : undefined;
    if (level === 1) {
      mst_kode_wilayah = '000000  ';
    }
    return this.prisma.mst_wilayah.findMany({
      where: {
        id_level_wilayah: level,
        mst_kode_wilayah,
      },
      select: { kode_wilayah: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getLembagaPengangkat() {
    return this.prisma.lembaga_pengangkat.findMany({
      select: { lembaga_pengangkat_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getPangkatGolongan() {
    return this.prisma.pangkat_golongan.findMany({
      select: { pangkat_golongan_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getStatusKepegawaian() {
    return this.prisma.status_kepegawaian.findMany({
      select: { status_kepegawaian_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getSumberGaji() {
    return this.prisma.sumber_gaji.findMany({
      select: { sumber_gaji_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getAlatTransportasi() {
    return this.prisma.alat_transportasi.findMany({
      select: { alat_transportasi_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getJenisCita() {
    return this.prisma.jenis_cita.findMany({
      select: { id_cita: true, nm_cita: true },
      orderBy: { nm_cita: 'asc' },
    });
  }

  async getJenisHobby() {
    return this.prisma.jenis_hobby.findMany({
      select: { id_hobby: true, nm_hobby: true },
      orderBy: { nm_hobby: 'asc' },
    });
  }

  async getAlasanLayakPip() {
    return this.prisma.alasan_layak_pip.findMany({
      select: { id_layak_pip: true, alasan_layak_pip: true },
      orderBy: { alasan_layak_pip: 'asc' },
    });
  }

  async getJenisPendaftaran() {
    return this.prisma.jenis_pendaftaran.findMany({
      select: { jenis_pendaftaran_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getJenisTinggal() {
    return this.prisma.jenis_tinggal.findMany({
      select: { jenis_tinggal_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getJenisKeluar() {
    return this.prisma.jenis_keluar.findMany({
      select: { jenis_keluar_id: true, ket_keluar: true },
      orderBy: { ket_keluar: 'asc' },
    });
  }

  async getKebutuhanKhusus() {
    return this.prisma.kebutuhan_khusus.findMany({
      select: { kebutuhan_khusus_id: true, kebutuhan_khusus: true },
      orderBy: { kebutuhan_khusus: 'asc' },
    });
  }

  async getPekerjaan() {
    return this.prisma.pekerjaan.findMany({
      select: { pekerjaan_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getJenjangPendidikan() {
    return this.prisma.jenjang_pendidikan.findMany({
      select: { jenjang_pendidikan_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  async getPenghasilan() {
    return this.prisma.penghasilan.findMany({
      select: { penghasilan_id: true, nama: true },
      orderBy: { nama: 'asc' },
    });
  }

  /**
   * Returns all reference options in a single call (excluding large mst_wilayah tables, unless requested, or with a small limit)
   */
  async getAllOptions() {
    const [
      agama,
      bank,
      jabatan_ptk,
      jenis_ptk,
      keahlian_laboratorium,
      lembaga_pengangkat,
      pangkat_golongan,
      status_kepegawaian,
      sumber_gaji,
      alat_transportasi,
      jenis_cita,
      jenis_hobby,
      alasan_layak_pip,
      jenis_pendaftaran,
      jenis_tinggal,
      jenis_keluar,
      kebutuhan_khusus,
      pekerjaan,
      jenjang_pendidikan,
      penghasilan,
    ] = await Promise.all([
      this.getAgama(),
      this.getBank(),
      this.getJabatanPtk(),
      this.getJenisPtk(),
      this.getKeahlianLaboratorium(),
      this.getLembagaPengangkat(),
      this.getPangkatGolongan(),
      this.getStatusKepegawaian(),
      this.getSumberGaji(),
      this.getAlatTransportasi(),
      this.getJenisCita(),
      this.getJenisHobby(),
      this.getAlasanLayakPip(),
      this.getJenisPendaftaran(),
      this.getJenisTinggal(),
      this.getJenisKeluar(),
      this.getKebutuhanKhusus(),
      this.getPekerjaan(),
      this.getJenjangPendidikan(),
      this.getPenghasilan(),
    ]);

    return {
      agama,
      bank,
      jabatan_ptk,
      jenis_ptk,
      keahlian_laboratorium,
      lembaga_pengangkat,
      pangkat_golongan,
      status_kepegawaian,
      sumber_gaji,
      alat_transportasi,
      jenis_cita,
      jenis_hobby,
      alasan_layak_pip,
      jenis_pendaftaran,
      jenis_tinggal,
      jenis_keluar,
      kebutuhan_khusus,
      pekerjaan,
      jenjang_pendidikan,
      penghasilan,
    };
  }

  private formatYesNo(val: any): string | null {
    if (val === null || val === undefined) return null;
    const strVal = String(val).trim();
    if (strVal === '1' || strVal.toLowerCase() === 'true') return 'Ya';
    if (strVal === '0' || strVal.toLowerCase() === 'false') return 'Tidak';
    return null;
  }

  /**
   * Resolves ID values in a GTK record to their corresponding names/descriptions
   */
  async resolveGtk(gtk: any) {
    if (!gtk) return null;

    const [
      agama,
      bank,
      jabatan_ptk,
      jenis_ptk,
      keahlian_lab,
      wilayah,
      lembaga_pengangkat,
      pangkat_golongan,
      status_kepegawaian,
      sumber_gaji,
      pekerjaan_suami_istri,
      kebutuhan_khusus,
      jenis_keluar,
    ] = await Promise.all([
      gtk.agama_id ? this.prisma.agama.findUnique({ where: { agama_id: Number(gtk.agama_id) }, select: { nama: true } }) : null,
      gtk.id_bank ? this.prisma.bank.findUnique({ where: { id_bank: String(gtk.id_bank) }, select: { nm_bank: true } }) : null,
      gtk.jabatan_ptk_id ? this.prisma.jabatan_ptk.findUnique({ where: { jabatan_ptk_id: Number(gtk.jabatan_ptk_id) }, select: { jabatan_ptk: true } }) : null,
      gtk.jenis_ptk_id ? this.prisma.jenis_ptk.findUnique({ where: { jenis_ptk_id: Number(gtk.jenis_ptk_id) }, select: { jenis_ptk: true } }) : null,
      gtk.keahlian_laboratorium_id ? this.prisma.keahlian_laboratorium.findUnique({ where: { keahlian_laboratorium_id: Number(gtk.keahlian_laboratorium_id) }, select: { nama: true } }) : null,
      gtk.kode_wilayah ? this.prisma.mst_wilayah.findUnique({ where: { kode_wilayah: String(gtk.kode_wilayah) }, select: { nama: true } }) : null,
      gtk.lembaga_pengangkat_id ? this.prisma.lembaga_pengangkat.findUnique({ where: { lembaga_pengangkat_id: Number(gtk.lembaga_pengangkat_id) }, select: { nama: true } }) : null,
      gtk.pangkat_golongan_id ? this.prisma.pangkat_golongan.findUnique({ where: { pangkat_golongan_id: Number(gtk.pangkat_golongan_id) }, select: { nama: true } }) : null,
      gtk.status_kepegawaian_id ? this.prisma.status_kepegawaian.findUnique({ where: { status_kepegawaian_id: Number(gtk.status_kepegawaian_id) }, select: { nama: true } }) : null,
      gtk.sumber_gaji_id ? this.prisma.sumber_gaji.findUnique({ where: { sumber_gaji_id: Number(gtk.sumber_gaji_id) }, select: { nama: true } }) : null,
      gtk.pekerjaan_suami_istri ? this.prisma.pekerjaan.findUnique({ where: { pekerjaan_id: Number(gtk.pekerjaan_suami_istri) }, select: { nama: true } }) : null,
      gtk.kebutuhan_khusus_id ? this.prisma.kebutuhan_khusus.findUnique({ where: { kebutuhan_khusus_id: Number(gtk.kebutuhan_khusus_id) }, select: { kebutuhan_khusus: true } }) : null,
      gtk.jenis_keluar_id ? this.prisma.jenis_keluar.findUnique({ where: { jenis_keluar_id: String(gtk.jenis_keluar_id) }, select: { ket_keluar: true } }) : null,
    ]);

    let resolvedSertifikasi = [];
    if (gtk.rwy_sertifikasi && gtk.rwy_sertifikasi.length > 0) {
      resolvedSertifikasi = await Promise.all(
        gtk.rwy_sertifikasi.map(async (s: any) => {
          const [lemb, jenis, bidang] = await Promise.all([
            s.kode_lemb_sert ? this.prisma.lemb_sertifikasi.findUnique({ where: { kode_lemb_sert: Number(s.kode_lemb_sert) }, select: { nm_lemb_sert: true } }) : null,
            s.id_jenis_sertifikasi ? this.prisma.jenis_sertifikasi.findUnique({ where: { id_jenis_sertifikasi: Number(s.id_jenis_sertifikasi) }, select: { jenis_sertifikasi: true } }) : null,
            s.bidang_studi_id ? this.prisma.bidang_studi.findUnique({ where: { bidang_studi_id: Number(s.bidang_studi_id) }, select: { bidang_studi: true } }) : null,
          ]);
          return {
            ...s,
            lembaga_sertifikasi_nama: lemb?.nm_lemb_sert || s.kode_lemb_sert || null,
            jenis_sertifikasi_nama: jenis?.jenis_sertifikasi || s.id_jenis_sertifikasi || null,
            bidang_studi_nama: bidang?.bidang_studi || s.bidang_studi_id_str || null,
          };
        })
      );
    }

    let resolvedKepangkatan = [];
    if (gtk.rwy_kepangkatan && gtk.rwy_kepangkatan.length > 0) {
      resolvedKepangkatan = await Promise.all(
        gtk.rwy_kepangkatan.map(async (k: any) => {
          const pg = k.pangkat_golongan_id ? await this.prisma.pangkat_golongan.findUnique({ where: { pangkat_golongan_id: Number(k.pangkat_golongan_id) }, select: { nama: true } }) : null;
          return {
            ...k,
            pangkat_golongan_nama: pg?.nama || null,
          };
        })
      );
    }

    return {
      ...gtk,
      rwy_sertifikasi: resolvedSertifikasi,
      rwy_kepangkatan: resolvedKepangkatan,
      agama_nama: agama?.nama || null,
      bank_nama: bank?.nm_bank || null,
      jabatan_ptk_nama: jabatan_ptk?.jabatan_ptk || null,
      jenis_ptk_nama: jenis_ptk?.jenis_ptk || null,
      keahlian_laboratorium_nama: keahlian_lab?.nama || null,
      wilayah_nama: wilayah?.nama || null,
      lembaga_pengangkat_nama: lembaga_pengangkat?.nama || null,
      pangkat_golongan_nama: pangkat_golongan?.nama || null,
      status_kepegawaian_nama: status_kepegawaian?.nama || null,
      sumber_gaji_nama: sumber_gaji?.nama || null,
      pekerjaan_suami_istri_nama: pekerjaan_suami_istri?.nama || null,
      kebutuhan_khusus_nama: kebutuhan_khusus?.kebutuhan_khusus || null,
      jenis_keluar_nama: jenis_keluar?.ket_keluar || null,
      // Boolean format mapping (1 = Ya, 0 = Tidak)
      sudah_lisensi_kepala_sekolah_str: this.formatYesNo(gtk.sudah_lisensi_kepala_sekolah),
      pernah_diklat_kepengawasan_str: this.formatYesNo(gtk.pernah_diklat_kepengawasan),
      keahlian_braille_str: this.formatYesNo(gtk.keahlian_braille),
      keahlian_bhs_isyarat_str: this.formatYesNo(gtk.keahlian_bhs_isyarat),
      ptk_induk_str: this.formatYesNo(gtk.ptk_induk),
    };
  }

  /**
   * Resolves ID values in a PesertaDidik record to their corresponding names/descriptions
   */
  async resolvePesertaDidik(pd: any) {
    if (!pd) return null;

    const [
      agama,
      bank,
      wilayah,
      alat_transportasi,
      jenis_cita,
      jenis_hobby,
      alasan_layak_pip,
      jenis_pendaftaran,
      jenis_tinggal,
      jenis_keluar,
      rombongan_belajar,
      // Kebutuhan Khusus
      kebutuhan_khusus,
      kebutuhan_khusus_ayah,
      kebutuhan_khusus_ibu,
      // Pekerjaan
      pekerjaan,
      pekerjaan_ayah,
      pekerjaan_ibu,
      pekerjaan_wali,
      // Jenjang Pendidikan
      jenjang_pendidikan_ayah,
      jenjang_pendidikan_ibu,
      jenjang_pendidikan_wali,
      // Penghasilan
      penghasilan_ayah,
      penghasilan_ibu,
      penghasilan_wali,
    ] = await Promise.all([
      pd.agama_id ? this.prisma.agama.findUnique({ where: { agama_id: Number(pd.agama_id) }, select: { nama: true } }) : null,
      pd.id_bank ? this.prisma.bank.findUnique({ where: { id_bank: String(pd.id_bank) }, select: { nm_bank: true } }) : null,
      pd.kode_wilayah ? this.prisma.mst_wilayah.findUnique({ where: { kode_wilayah: String(pd.kode_wilayah) }, select: { nama: true } }) : null,
      pd.alat_transportasi_id ? this.prisma.alat_transportasi.findUnique({ where: { alat_transportasi_id: Number(pd.alat_transportasi_id) }, select: { nama: true } }) : null,
      pd.id_cita ? this.prisma.jenis_cita.findUnique({ where: { id_cita: Number(pd.id_cita) }, select: { nm_cita: true } }) : null,
      pd.id_hobby ? this.prisma.jenis_hobby.findUnique({ where: { id_hobby: Number(pd.id_hobby) }, select: { nm_hobby: true } }) : null,
      pd.id_layak_pip ? this.prisma.alasan_layak_pip.findUnique({ where: { id_layak_pip: Number(pd.id_layak_pip) }, select: { alasan_layak_pip: true } }) : null,
      pd.jenis_pendaftaran_id ? this.prisma.jenis_pendaftaran.findUnique({ where: { jenis_pendaftaran_id: Number(pd.jenis_pendaftaran_id) }, select: { nama: true } }) : null,
      pd.jenis_tinggal_id ? this.prisma.jenis_tinggal.findUnique({ where: { jenis_tinggal_id: Number(pd.jenis_tinggal_id) }, select: { nama: true } }) : null,
      pd.jenis_keluar_id ? this.prisma.jenis_keluar.findUnique({ where: { jenis_keluar_id: String(pd.jenis_keluar_id) }, select: { ket_keluar: true } }) : null,
      pd.rombongan_belajar_id ? this.prisma.rombonganBelajar.findUnique({ where: { rombongan_belajar_id: String(pd.rombongan_belajar_id) }, select: { nama: true } }) : null,
      // Kebutuhan Khusus
      pd.kebutuhan_khusus_id ? this.prisma.kebutuhan_khusus.findUnique({ where: { kebutuhan_khusus_id: Number(pd.kebutuhan_khusus_id) }, select: { kebutuhan_khusus: true } }) : null,
      pd.kebutuhan_khusus_id_ayah ? this.prisma.kebutuhan_khusus.findUnique({ where: { kebutuhan_khusus_id: Number(pd.kebutuhan_khusus_id_ayah) }, select: { kebutuhan_khusus: true } }) : null,
      pd.kebutuhan_khusus_id_ibu ? this.prisma.kebutuhan_khusus.findUnique({ where: { kebutuhan_khusus_id: Number(pd.kebutuhan_khusus_id_ibu) }, select: { kebutuhan_khusus: true } }) : null,
      // Pekerjaan
      pd.pekerjaan_id ? this.prisma.pekerjaan.findUnique({ where: { pekerjaan_id: Number(pd.pekerjaan_id) }, select: { nama: true } }) : null,
      pd.pekerjaan_id_ayah ? this.prisma.pekerjaan.findUnique({ where: { pekerjaan_id: Number(pd.pekerjaan_id_ayah) }, select: { nama: true } }) : null,
      pd.pekerjaan_id_ibu ? this.prisma.pekerjaan.findUnique({ where: { pekerjaan_id: Number(pd.pekerjaan_id_ibu) }, select: { nama: true } }) : null,
      pd.pekerjaan_id_wali ? this.prisma.pekerjaan.findUnique({ where: { pekerjaan_id: Number(pd.pekerjaan_id_wali) }, select: { nama: true } }) : null,
      // Jenjang Pendidikan
      pd.jenjang_pendidikan_ayah ? this.prisma.jenjang_pendidikan.findUnique({ where: { jenjang_pendidikan_id: Number(pd.jenjang_pendidikan_ayah) }, select: { nama: true } }) : null,
      pd.jenjang_pendidikan_ibu ? this.prisma.jenjang_pendidikan.findUnique({ where: { jenjang_pendidikan_id: Number(pd.jenjang_pendidikan_ibu) }, select: { nama: true } }) : null,
      pd.jenjang_pendidikan_wali ? this.prisma.jenjang_pendidikan.findUnique({ where: { jenjang_pendidikan_id: Number(pd.jenjang_pendidikan_wali) }, select: { nama: true } }) : null,
      // Penghasilan
      pd.penghasilan_id_ayah ? this.prisma.penghasilan.findUnique({ where: { penghasilan_id: Number(pd.penghasilan_id_ayah) }, select: { nama: true } }) : null,
      pd.penghasilan_id_ibu ? this.prisma.penghasilan.findUnique({ where: { penghasilan_id: Number(pd.penghasilan_id_ibu) }, select: { nama: true } }) : null,
      pd.penghasilan_id_wali ? this.prisma.penghasilan.findUnique({ where: { penghasilan_id: Number(pd.penghasilan_id_wali) }, select: { nama: true } }) : null,
    ]);

    return {
      ...pd,
      agama_nama: agama?.nama || null,
      bank_nama: bank?.nm_bank || null,
      wilayah_nama: wilayah?.nama || null,
      alat_transportasi_nama: alat_transportasi?.nama || null,
      jenis_cita_nama: jenis_cita?.nm_cita || null,
      jenis_hobby_nama: jenis_hobby?.nm_hobby || null,
      alasan_layak_pip_nama: alasan_layak_pip?.alasan_layak_pip || null,
      jenis_pendaftaran_nama: jenis_pendaftaran?.nama || null,
      jenis_tinggal_nama: jenis_tinggal?.nama || null,
      jenis_keluar_nama: jenis_keluar?.ket_keluar || null,
      rombongan_belajar_nama: rombongan_belajar?.nama || null,
      kebutuhan_khusus_nama: kebutuhan_khusus?.kebutuhan_khusus || null,
      kebutuhan_khusus_ayah_nama: kebutuhan_khusus_ayah?.kebutuhan_khusus || null,
      kebutuhan_khusus_ibu_nama: kebutuhan_khusus_ibu?.kebutuhan_khusus || null,
      pekerjaan_nama: pekerjaan?.nama || null,
      pekerjaan_ayah_nama: pekerjaan_ayah?.nama || null,
      pekerjaan_ibu_nama: pekerjaan_ibu?.nama || null,
      pekerjaan_wali_nama: pekerjaan_wali?.nama || null,
      jenjang_pendidikan_ayah_nama: jenjang_pendidikan_ayah?.nama || null,
      jenjang_pendidikan_ibu_nama: jenjang_pendidikan_ibu?.nama || null,
      jenjang_pendidikan_wali_nama: jenjang_pendidikan_wali?.nama || null,
      penghasilan_ayah_nama: penghasilan_ayah?.nama || null,
      penghasilan_ibu_nama: penghasilan_ibu?.nama || null,
      penghasilan_wali_nama: penghasilan_wali?.nama || null,
      // Boolean format mapping (1 = Ya, 0 = Tidak)
      penerima_kps_str: this.formatYesNo(pd.penerima_kps),
      layak_pip_str: this.formatYesNo(pd.layak_pip),
      penerima_kip_str: this.formatYesNo(pd.penerima_kip),
      a_pernah_paud_str: this.formatYesNo(pd.a_pernah_paud),
      a_pernah_tk_str: this.formatYesNo(pd.a_pernah_tk),
    };
  }
}
