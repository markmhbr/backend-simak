"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandalaSuratService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/prisma/prisma.service");
let MandalaSuratService = class MandalaSuratService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    romanMonths = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
    ];
    indonesianMonths = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    formatIndonesianDate(date) {
        const day = date.getDate();
        const month = this.indonesianMonths[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    async createPengaturanNomor(cadisdikId, dto) {
        try {
            return await this.prisma.mandalaPengaturanNomorSurat.create({
                data: {
                    cadisdik_id: cadisdikId,
                    kategori: Number(dto.kategori),
                    nama_label: dto.nama_label,
                    format_nomor: dto.format_nomor,
                    counter: dto.counter !== undefined ? Number(dto.counter) : 0,
                    aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : true,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Label untuk kategori surat ini sudah ada di kantor Cadisdik ini.');
            }
            throw error;
        }
    }
    async getPengaturanNomorList(cadisdikId) {
        return await this.prisma.mandalaPengaturanNomorSurat.findMany({
            where: { cadisdik_id: cadisdikId },
            orderBy: { created_at: 'desc' },
        });
    }
    async updatePengaturanNomor(id, dto) {
        const config = await this.prisma.mandalaPengaturanNomorSurat.findUnique({ where: { pengaturan_nomor_surat_id: id } });
        if (!config)
            throw new common_1.NotFoundException('Pengaturan nomor surat tidak ditemukan.');
        return await this.prisma.mandalaPengaturanNomorSurat.update({
            where: { pengaturan_nomor_surat_id: id },
            data: {
                kategori: dto.kategori !== undefined ? Number(dto.kategori) : undefined,
                nama_label: dto.nama_label,
                format_nomor: dto.format_nomor,
                counter: dto.counter !== undefined ? Number(dto.counter) : undefined,
                aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : undefined,
            },
        });
    }
    async deletePengaturanNomor(id) {
        const config = await this.prisma.mandalaPengaturanNomorSurat.findUnique({ where: { pengaturan_nomor_surat_id: id } });
        if (!config)
            throw new common_1.NotFoundException('Pengaturan nomor surat tidak ditemukan.');
        await this.prisma.mandalaPengaturanNomorSurat.delete({
            where: { pengaturan_nomor_surat_id: id },
        });
    }
    async createTemplate(cadisdikId, dto) {
        return await this.prisma.mandalaTemplateSurat.create({
            data: {
                cadisdik_id: cadisdikId,
                nama_template: dto.nama_template,
                kategori: Number(dto.kategori),
                ukuran_kertas: Number(dto.ukuran_kertas),
                margin_atas: dto.margin_atas !== undefined ? Number(dto.margin_atas) : 20,
                margin_bawah: dto.margin_bawah !== undefined ? Number(dto.margin_bawah) : 20,
                margin_kiri: dto.margin_kiri !== undefined ? Number(dto.margin_kiri) : 20,
                margin_kanan: dto.margin_kanan !== undefined ? Number(dto.margin_kanan) : 20,
                konten_html: dto.konten_html,
                aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : true,
            },
        });
    }
    async getTemplateList(cadisdikId) {
        return await this.prisma.mandalaTemplateSurat.findMany({
            where: { cadisdik_id: cadisdikId },
            orderBy: { created_at: 'desc' },
        });
    }
    async getTemplateDetail(id) {
        const template = await this.prisma.mandalaTemplateSurat.findUnique({ where: { template_surat_id: id } });
        if (!template)
            throw new common_1.NotFoundException('Template surat tidak ditemukan.');
        return template;
    }
    async updateTemplate(id, dto) {
        const template = await this.prisma.mandalaTemplateSurat.findUnique({ where: { template_surat_id: id } });
        if (!template)
            throw new common_1.NotFoundException('Template surat tidak ditemukan.');
        return await this.prisma.mandalaTemplateSurat.update({
            where: { template_surat_id: id },
            data: {
                nama_template: dto.nama_template,
                kategori: dto.kategori !== undefined ? Number(dto.kategori) : undefined,
                ukuran_kertas: dto.ukuran_kertas !== undefined ? Number(dto.ukuran_kertas) : undefined,
                margin_atas: dto.margin_atas !== undefined ? Number(dto.margin_atas) : undefined,
                margin_bawah: dto.margin_bawah !== undefined ? Number(dto.margin_bawah) : undefined,
                margin_kiri: dto.margin_kiri !== undefined ? Number(dto.margin_kiri) : undefined,
                margin_kanan: dto.margin_kanan !== undefined ? Number(dto.margin_kanan) : undefined,
                konten_html: dto.konten_html,
                aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : undefined,
            },
        });
    }
    async deleteTemplate(id) {
        const template = await this.prisma.mandalaTemplateSurat.findUnique({ where: { template_surat_id: id } });
        if (!template)
            throw new common_1.NotFoundException('Template surat tidak ditemukan.');
        await this.prisma.mandalaTemplateSurat.delete({
            where: { template_surat_id: id },
        });
    }
    async createSuratMasuk(cadisdikId, dto) {
        try {
            return await this.prisma.mandalaSuratMasuk.create({
                data: {
                    cadisdik_id: cadisdikId,
                    tanggal_surat: new Date(dto.tanggal_surat),
                    tanggal_diterima: new Date(dto.tanggal_diterima),
                    nomor_agenda: dto.nomor_agenda,
                    nomor_surat: dto.nomor_surat,
                    asal_surat: dto.asal_surat,
                    tujuan_disposisi: dto.tujuan_disposisi,
                    perihal: dto.perihal,
                    keterangan: dto.keterangan || null,
                    file_url: dto.file_url,
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Nomor agenda ini sudah digunakan di kantor Cadisdik ini.');
            }
            throw error;
        }
    }
    async getSuratMasukList(cadisdikId, query) {
        const { search, limit, page } = query;
        const where = { cadisdik_id: cadisdikId };
        if (search) {
            where.OR = [
                { nomor_surat: { contains: search, mode: 'insensitive' } },
                { nomor_agenda: { contains: search, mode: 'insensitive' } },
                { asal_surat: { contains: search, mode: 'insensitive' } },
                { perihal: { contains: search, mode: 'insensitive' } },
            ];
        }
        const take = limit ? parseInt(limit, 10) : 10;
        const skip = page ? (parseInt(page, 10) - 1) * take : 0;
        const [total, data] = await Promise.all([
            this.prisma.mandalaSuratMasuk.count({ where }),
            this.prisma.mandalaSuratMasuk.findMany({
                where,
                take,
                skip,
                orderBy: { tanggal_diterima: 'desc' },
            }),
        ]);
        return {
            status: 'success',
            data,
            meta: {
                total_data: total,
                total_pages: Math.ceil(total / take),
                current_page: page ? parseInt(page, 10) : 1,
            },
        };
    }
    async updateSuratMasuk(id, dto) {
        const surat = await this.prisma.mandalaSuratMasuk.findUnique({ where: { surat_masuk_id: id } });
        if (!surat)
            throw new common_1.NotFoundException('Surat masuk tidak ditemukan.');
        return await this.prisma.mandalaSuratMasuk.update({
            where: { surat_masuk_id: id },
            data: {
                tanggal_surat: dto.tanggal_surat ? new Date(dto.tanggal_surat) : undefined,
                tanggal_diterima: dto.tanggal_diterima ? new Date(dto.tanggal_diterima) : undefined,
                nomor_agenda: dto.nomor_agenda,
                nomor_surat: dto.nomor_surat,
                asal_surat: dto.asal_surat,
                tujuan_disposisi: dto.tujuan_disposisi,
                perihal: dto.perihal,
                keterangan: dto.keterangan || null,
                file_url: dto.file_url,
            },
        });
    }
    async deleteSuratMasuk(id) {
        const surat = await this.prisma.mandalaSuratMasuk.findUnique({ where: { surat_masuk_id: id } });
        if (!surat)
            throw new common_1.NotFoundException('Surat masuk tidak ditemukan.');
        await this.prisma.mandalaSuratMasuk.delete({
            where: { surat_masuk_id: id },
        });
    }
    async createSuratKeluar(cadisdikId, dto) {
        const template = await this.prisma.mandalaTemplateSurat.findUnique({ where: { template_surat_id: dto.template_surat_id } });
        if (!template)
            throw new common_1.NotFoundException('Template surat tidak ditemukan.');
        const numberConfig = await this.prisma.mandalaPengaturanNomorSurat.findUnique({ where: { pengaturan_nomor_surat_id: dto.pengaturan_nomor_surat_id } });
        if (!numberConfig)
            throw new common_1.NotFoundException('Pengaturan penomoran surat tidak ditemukan.');
        const initialParsedHtml = await this.parseTemplate(cadisdikId, template.konten_html, template.kategori, {
            sekolah_id: dto.sekolah_id,
            pegawai_id: dto.pegawai_id,
            nomor_surat: '[DRAFT - BELUM DITERBITKAN]',
            tanggal_surat: new Date(dto.tanggal_surat),
        });
        return await this.prisma.mandalaSuratKeluar.create({
            data: {
                cadisdik_id: cadisdikId,
                template_surat_id: dto.template_surat_id,
                pengaturan_nomor_surat_id: dto.pengaturan_nomor_surat_id,
                kategori: template.kategori,
                sekolah_id: dto.sekolah_id || null,
                pegawai_id: dto.pegawai_id || null,
                nomor_surat: null,
                tanggal_surat: new Date(dto.tanggal_surat),
                perihal: dto.perihal,
                isi_final_html: initialParsedHtml,
                status: 1,
            },
        });
    }
    async getSuratKeluarList(cadisdikId, query) {
        const { search, limit, page, status, kategori } = query;
        const andConditions = [{ cadisdik_id: cadisdikId }];
        if (search) {
            andConditions.push({
                OR: [
                    { nomor_surat: { contains: search, mode: 'insensitive' } },
                    { perihal: { contains: search, mode: 'insensitive' } },
                ]
            });
        }
        if (status !== undefined) {
            andConditions.push({ status: Number(status) });
        }
        if (kategori !== undefined) {
            andConditions.push({ kategori: Number(kategori) });
        }
        const where = { AND: andConditions };
        const take = limit ? parseInt(limit, 10) : 10;
        const skip = page ? (parseInt(page, 10) - 1) * take : 0;
        const [total, data] = await Promise.all([
            this.prisma.mandalaSuratKeluar.count({ where }),
            this.prisma.mandalaSuratKeluar.findMany({
                where,
                take,
                skip,
                include: {
                    template_surat: { select: { nama_template: true } },
                    pegawai: { select: { nama_lengkap: true } },
                    sekolah: { select: { nama: true } },
                },
                orderBy: { created_at: 'desc' },
            }),
        ]);
        return {
            status: 'success',
            data,
            meta: {
                total_data: total,
                total_pages: Math.ceil(total / take),
                current_page: page ? parseInt(page, 10) : 1,
            },
        };
    }
    async getSuratKeluarDetail(id) {
        const surat = await this.prisma.mandalaSuratKeluar.findUnique({
            where: { surat_keluar_id: id },
            include: {
                template_surat: true,
                pegawai: true,
                sekolah: true,
            },
        });
        if (!surat)
            throw new common_1.NotFoundException('Surat keluar tidak ditemukan.');
        return surat;
    }
    async updateSuratKeluar(id, dto) {
        const surat = await this.prisma.mandalaSuratKeluar.findUnique({ where: { surat_keluar_id: id } });
        if (!surat)
            throw new common_1.NotFoundException('Surat keluar tidak ditemukan.');
        if (surat.status === 2) {
            throw new common_1.BadRequestException('Surat yang sudah terbit tidak boleh diubah.');
        }
        const template = await this.prisma.mandalaTemplateSurat.findUnique({ where: { template_surat_id: surat.template_surat_id } });
        const initialParsedHtml = await this.parseTemplate(surat.cadisdik_id, template.konten_html, template.kategori, {
            sekolah_id: dto.sekolah_id || surat.sekolah_id,
            pegawai_id: dto.pegawai_id || surat.pegawai_id,
            nomor_surat: '[DRAFT - BELUM DITERBITKAN]',
            tanggal_surat: dto.tanggal_surat ? new Date(dto.tanggal_surat) : surat.tanggal_surat,
        });
        return await this.prisma.mandalaSuratKeluar.update({
            where: { surat_keluar_id: id },
            data: {
                sekolah_id: dto.sekolah_id !== undefined ? dto.sekolah_id : undefined,
                pegawai_id: dto.pegawai_id !== undefined ? dto.pegawai_id : undefined,
                tanggal_surat: dto.tanggal_surat ? new Date(dto.tanggal_surat) : undefined,
                perihal: dto.perihal,
                isi_final_html: initialParsedHtml,
            },
        });
    }
    async terbitkanSurat(id) {
        const surat = await this.prisma.mandalaSuratKeluar.findUnique({ where: { surat_keluar_id: id } });
        if (!surat)
            throw new common_1.NotFoundException('Surat keluar tidak ditemukan.');
        if (surat.status === 2) {
            throw new common_1.BadRequestException('Surat sudah terbit.');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const numberConfig = await tx.mandalaPengaturanNomorSurat.findUnique({
                where: { pengaturan_nomor_surat_id: surat.pengaturan_nomor_surat_id },
            });
            if (!numberConfig)
                throw new common_1.NotFoundException('Konfigurasi nomor surat tidak ditemukan.');
            const nextCounter = numberConfig.counter + 1;
            const officialNumber = this.generateOfficialNumber(numberConfig.format_nomor, {
                no: nextCounter.toString().padStart(3, '0'),
                label: numberConfig.nama_label,
                date: new Date(surat.tanggal_surat),
            });
            await tx.mandalaPengaturanNomorSurat.update({
                where: { pengaturan_nomor_surat_id: numberConfig.pengaturan_nomor_surat_id },
                data: { counter: nextCounter },
            });
            const template = await tx.mandalaTemplateSurat.findUnique({ where: { template_surat_id: surat.template_surat_id } });
            const finalParsedHtml = await this.parseTemplateWithTransaction(tx, surat.cadisdik_id, template.konten_html, template.kategori, {
                sekolah_id: surat.sekolah_id,
                pegawai_id: surat.pegawai_id,
                nomor_surat: officialNumber,
                tanggal_surat: new Date(surat.tanggal_surat),
            });
            return await tx.mandalaSuratKeluar.update({
                where: { surat_keluar_id: id },
                data: {
                    nomor_surat: officialNumber,
                    isi_final_html: finalParsedHtml,
                    status: 2,
                },
            });
        });
        return result;
    }
    async deleteSuratKeluar(id) {
        const surat = await this.prisma.mandalaSuratKeluar.findUnique({ where: { surat_keluar_id: id } });
        if (!surat)
            throw new common_1.NotFoundException('Surat keluar tidak ditemukan.');
        if (surat.status === 2) {
            throw new common_1.BadRequestException('Surat yang sudah terbit tidak boleh dihapus.');
        }
        await this.prisma.mandalaSuratKeluar.delete({
            where: { surat_keluar_id: id },
        });
    }
    generateOfficialNumber(format, params) {
        const month = params.date.getMonth() + 1;
        const year = params.date.getFullYear();
        const romawi = this.romanMonths[month - 1];
        const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
        return format
            .replace(/{NO}/g, params.no)
            .replace(/{LABEL}/g, params.label)
            .replace(/{ROMAWI}/g, romawi)
            .replace(/{BULAN}/g, doubleDigitMonth)
            .replace(/{TAHUN}/g, year.toString());
    }
    async parseTemplate(cadisdikId, templateHtml, category, context) {
        return await this.parseTemplateWithTransaction(this.prisma, cadisdikId, templateHtml, category, context);
    }
    async parseTemplateWithTransaction(tx, cadisdikId, templateHtml, category, context) {
        let html = templateHtml;
        const month = context.tanggal_surat.getMonth() + 1;
        const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
        const romawi = this.romanMonths[month - 1];
        const year = context.tanggal_surat.getFullYear().toString();
        html = html
            .replace(/{{nomor_surat}}/g, context.nomor_surat)
            .replace(/{{tanggal_surat}}/g, this.formatIndonesianDate(context.tanggal_surat))
            .replace(/{{bulan}}/g, doubleDigitMonth)
            .replace(/{{bulan_romawi}}/g, romawi)
            .replace(/{{tahun}}/g, year);
        const cadisdik = await tx.cadisdik.findUnique({ where: { cadisdik_id: cadisdikId } });
        if (cadisdik) {
            html = html
                .replace(/{{nama_cadisdik}}/g, cadisdik.nama_instansi || '')
                .replace(/{{alamat_cadisdik}}/g, cadisdik.alamat || '')
                .replace(/{{email_cadisdik}}/g, cadisdik.email || '')
                .replace(/{{telepon_cadisdik}}/g, cadisdik.nomor_telepon || '');
        }
        if (context.sekolah_id) {
            const school = await tx.sekolah.findUnique({ where: { sekolah_id: context.sekolah_id } });
            if (school) {
                html = html
                    .replace(/{{nama_sekolah}}/g, school.nama || '')
                    .replace(/{{alamat_sekolah}}/g, school.alamat_jalan || '')
                    .replace(/{{telepon_sekolah}}/g, school.nomor_telepon || '')
                    .replace(/{{npsn}}/g, school.npsn || '');
            }
        }
        if (context.pegawai_id) {
            const pegawai = await tx.pegawai.findUnique({ where: { pegawai_id: context.pegawai_id } });
            if (pegawai) {
                html = html
                    .replace(/{{nama_lengkap}}/g, pegawai.nama_lengkap || '')
                    .replace(/{{nip}}/g, pegawai.nip || '')
                    .replace(/{{nik}}/g, pegawai.nik || '')
                    .replace(/{{jabatan}}/g, String(pegawai.jabatan || ''));
            }
        }
        return html;
    }
};
exports.MandalaSuratService = MandalaSuratService;
exports.MandalaSuratService = MandalaSuratService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MandalaSuratService);
//# sourceMappingURL=mandala-surat.service.js.map