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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandalaController = void 0;
const common_1 = require("@nestjs/common");
const mandala_service_1 = require("./mandala.service");
const mandala_key_guard_1 = require("../../core/mandala/mandala-key.guard");
let MandalaController = class MandalaController {
    mandalaService;
    constructor(mandalaService) {
        this.mandalaService = mandalaService;
    }
    async getConnection() {
        const config = await this.mandalaService.getConnection();
        if (!config) {
            throw new common_1.NotFoundException('Mandala connection is not configured yet.');
        }
        return {
            status: 'success',
            data: config,
        };
    }
    async updateConnection(body) {
        if (!body.key || !body.url_mandala) {
            return {
                status: 'error',
                message: 'Both key and url_mandala are required.',
            };
        }
        const result = await this.mandalaService.saveOrUpdateConnection(body.key, body.url_mandala);
        return {
            status: 'success',
            message: 'Mandala connection successfully updated.',
            data: result,
        };
    }
    async getSchools() {
        const data = await this.mandalaService.getSchools();
        return {
            status: 'success',
            data,
        };
    }
    async getProvinsiList() {
        const data = await this.mandalaService.getAllProvinsi();
        return {
            status: 'success',
            data,
        };
    }
    async getKabupatenList(provinsiNama) {
        const data = await this.mandalaService.getKabupatenByProvinsi(provinsiNama);
        return {
            status: 'success',
            data,
        };
    }
    async getCadisdiks() {
        const data = await this.mandalaService.getCadisdiks();
        return {
            status: 'success',
            data,
        };
    }
    async getCadisdikDetail(id) {
        const data = await this.mandalaService.getCadisdikById(id);
        return {
            status: 'success',
            data,
        };
    }
    async createCadisdik(body) {
        if (!body.nama_instansi) {
            throw new common_1.BadRequestException('nama_instansi is required.');
        }
        const data = await this.mandalaService.createCadisdik(body);
        return {
            status: 'success',
            message: 'Cadisdik successfully created.',
            data,
        };
    }
    async updateCadisdik(id, body) {
        const data = await this.mandalaService.updateCadisdik(id, body);
        return {
            status: 'success',
            message: 'Cadisdik successfully updated.',
            data,
        };
    }
    async deleteCadisdik(id) {
        await this.mandalaService.deleteCadisdik(id);
        return {
            status: 'success',
            message: 'Cadisdik successfully deleted.',
        };
    }
    async getKategoriKeperluan(cadisdikId) {
        const data = await this.mandalaService.getKategoriKeperluan(cadisdikId);
        return {
            status: 'success',
            data,
        };
    }
    async createKategoriKeperluan(body) {
        if (!body.cadisdik_id || !body.nama) {
            throw new common_1.BadRequestException('cadisdik_id and nama are required.');
        }
        const data = await this.mandalaService.createKategoriKeperluan(body);
        return {
            status: 'success',
            message: 'Kategori keperluan successfully created.',
            data,
        };
    }
    async updateKategoriKeperluan(id, body) {
        const data = await this.mandalaService.updateKategoriKeperluan(id, body);
        return {
            status: 'success',
            message: 'Kategori keperluan successfully updated.',
            data,
        };
    }
    async deleteKategoriKeperluan(id) {
        await this.mandalaService.deleteKategoriKeperluan(id);
        return {
            status: 'success',
            message: 'Kategori keperluan successfully deleted.',
        };
    }
    async getAntrian(cadisdikId, status, startDate, endDate) {
        const data = await this.mandalaService.getAntrian({
            cadisdik_id: cadisdikId,
            status: status !== undefined ? parseInt(status, 10) : undefined,
            start_date: startDate,
            end_date: endDate,
        });
        return {
            status: 'success',
            data,
        };
    }
    async createAntrian(body) {
        if (!body.cadisdik_id || !body.kategori_keperluan_id || !body.nama_lengkap) {
            throw new common_1.BadRequestException('cadisdik_id, kategori_keperluan_id, and nama_lengkap are required.');
        }
        const data = await this.mandalaService.createAntrian(body);
        return {
            status: 'success',
            message: 'Antrian successfully created.',
            data,
        };
    }
    async updateAntrianStatus(id, status) {
        if (status === undefined) {
            throw new common_1.BadRequestException('status is required.');
        }
        const data = await this.mandalaService.updateAntrianStatus(id, status);
        return {
            status: 'success',
            message: 'Antrian status successfully updated.',
            data,
        };
    }
    async getAntrianRekap(cadisdikId) {
        const data = await this.mandalaService.getAntrianSummary(cadisdikId);
        return {
            status: 'success',
            data,
        };
    }
    async getJenisJabatans() {
        const data = await this.mandalaService.getJenisJabatans();
        return {
            status: 'success',
            data,
        };
    }
    async getJenisJabatanDetail(id) {
        const data = await this.mandalaService.getJenisJabatanById(id);
        return {
            status: 'success',
            data,
        };
    }
    async createJenisJabatan(body) {
        if (!body.nama || body.nama.trim() === '') {
            throw new common_1.BadRequestException('nama is required.');
        }
        const data = await this.mandalaService.createJenisJabatan(body);
        return {
            status: 'success',
            message: 'Jenis Jabatan successfully created.',
            data,
        };
    }
    async updateJenisJabatan(id, body) {
        if (!body.nama || body.nama.trim() === '') {
            throw new common_1.BadRequestException('nama is required.');
        }
        const data = await this.mandalaService.updateJenisJabatan(id, body);
        return {
            status: 'success',
            message: 'Jenis Jabatan successfully updated.',
            data,
        };
    }
    async deleteJenisJabatan(id) {
        await this.mandalaService.deleteJenisJabatan(id);
        return {
            status: 'success',
            message: 'Jenis Jabatan successfully deleted.',
        };
    }
    async loginPegawai(body) {
        if (!body.identifier || !body.password) {
            throw new common_1.BadRequestException('identifier (NIP/Email) and password are required.');
        }
        return await this.mandalaService.loginPegawai(body);
    }
    async verify2FA(body) {
        if (!body.tempToken || !body.code) {
            throw new common_1.BadRequestException('tempToken and code are required.');
        }
        return await this.mandalaService.verify2FAPegawai(body.tempToken, body.code, body.secretToSave);
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.BadRequestException('refreshToken is required.');
        }
        return await this.mandalaService.refreshTokensPegawai(refreshToken);
    }
    async getPegawais(cadisdikId) {
        const data = await this.mandalaService.getPegawais(cadisdikId);
        return {
            status: 'success',
            data,
        };
    }
    async getPegawaiDetail(id) {
        const data = await this.mandalaService.getPegawaiById(id);
        return {
            status: 'success',
            data,
        };
    }
    async createPegawai(body) {
        if (!body.cadisdik_id ||
            !body.nama_lengkap ||
            !body.nik ||
            !body.tempat_lahir ||
            !body.tanggal_lahir ||
            !body.alamat_lengkap ||
            !body.email ||
            !body.password ||
            (body.jabatan === undefined && !body.jenis_jabatan_id) ||
            body.jenis_kelamin === undefined) {
            throw new common_1.BadRequestException('Required fields: cadisdik_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat_lengkap, email, password, jenis_kelamin. Either jabatan or jenis_jabatan_id must be provided.');
        }
        const data = await this.mandalaService.createPegawai(body);
        return {
            status: 'success',
            message: 'Pegawai successfully created.',
            data,
        };
    }
    async updatePegawai(id, body) {
        const data = await this.mandalaService.updatePegawai(id, body);
        return {
            status: 'success',
            message: 'Pegawai successfully updated.',
            data,
        };
    }
    async deletePegawai(id) {
        await this.mandalaService.deletePegawai(id);
        return {
            status: 'success',
            message: 'Pegawai successfully deleted.',
        };
    }
    async reset2FAPegawai(id) {
        await this.mandalaService.reset2FAPegawai(id);
        return {
            status: 'success',
            message: 'Pegawai 2FA successfully reset.',
        };
    }
    async getMappingPengawas(pegawaiId, sekolahId) {
        const data = await this.mandalaService.getMappingPengawas(pegawaiId, sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async createMappingPengawas(body) {
        if (!body.pegawai_id || !body.sekolah_id) {
            throw new common_1.BadRequestException('pegawai_id and sekolah_id are required.');
        }
        const data = await this.mandalaService.createMappingPengawas(body);
        return {
            status: 'success',
            message: 'Mapping Pengawas successfully created.',
            data,
        };
    }
    async deleteMappingPengawas(id) {
        await this.mandalaService.deleteMappingPengawas(id);
        return {
            status: 'success',
            message: 'Mapping Pengawas successfully deleted.',
        };
    }
    async getSchoolDetail(id) {
        const data = await this.mandalaService.getSchoolDetail(id);
        if (!data) {
            throw new common_1.NotFoundException(`School with ID ${id} not found.`);
        }
        return {
            status: 'success',
            data,
        };
    }
    async getSchoolSummary(id) {
        const data = await this.mandalaService.getSchoolSummary(id);
        if (!data) {
            throw new common_1.NotFoundException(`School with ID ${id} not found.`);
        }
        return {
            status: 'success',
            data,
        };
    }
    async getPesertaDidik(sekolahId, limit, page, search, status) {
        let take = limit ? parseInt(limit, 10) : 10;
        if (take > 100) {
            take = 100;
        }
        const skipPage = page ? parseInt(page, 10) : 1;
        return await this.mandalaService.getPesertaDidikForMandala(sekolahId, {
            limit: take,
            page: skipPage,
            search,
            status
        });
    }
    async getGtk(sekolahId, limit, page, search, status, type, tab) {
        if (tab === 'rekap') {
            return await this.mandalaService.getGtkRekapForMandala(sekolahId);
        }
        let take = limit ? parseInt(limit, 10) : 10;
        if (take > 100) {
            take = 100;
        }
        const skipPage = page ? parseInt(page, 10) : 1;
        return await this.mandalaService.getGtkForMandala(sekolahId, {
            limit: take,
            page: skipPage,
            search,
            status,
            type
        });
    }
    async getPesertaDidikPresence(sekolahId, tanggal) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id is required.');
        }
        const date = tanggal ? new Date(tanggal) : new Date();
        const data = await this.mandalaService.getPesertaDidikPresenceForMandala(sekolahId, date);
        return {
            status: 'success',
            data,
        };
    }
    async getGtkPresence(sekolahId, tanggal) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id is required.');
        }
        const date = tanggal ? new Date(tanggal) : new Date();
        const data = await this.mandalaService.getGtkPresenceForMandala(sekolahId, date);
        return {
            status: 'success',
            data,
        };
    }
    async getPesertaDidikPresenceSummary(sekolahId, tahun) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id is required.');
        }
        const year = tahun ? parseInt(tahun, 10) : new Date().getFullYear();
        const data = await this.mandalaService.getPesertaDidikAnnualSummaryForMandala(sekolahId, year);
        return {
            status: 'success',
            data,
        };
    }
    async getGtkPresenceSummary(sekolahId, tahun) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id is required.');
        }
        const year = tahun ? parseInt(tahun, 10) : new Date().getFullYear();
        const data = await this.mandalaService.getGtkAnnualSummaryForMandala(sekolahId, year);
        return {
            status: 'success',
            data,
        };
    }
    async getSemesterIds() {
        const data = await this.mandalaService.getSemestersForMandala();
        return {
            status: 'success',
            data,
        };
    }
    async getMenuRoles() {
        const data = await this.mandalaService.getMenuRoles();
        return {
            status: 'success',
            data,
        };
    }
    async updateMenuRoles(body) {
        if (!body.roles || !Array.isArray(body.roles)) {
            throw new common_1.BadRequestException('Roles array is required.');
        }
        const result = await this.mandalaService.updateMenuRoles(body.roles);
        return {
            status: 'success',
            message: 'Menu roles successfully updated.',
            data: result,
        };
    }
    async getSekolahBinaan(req) {
        const user = req['user'];
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid user token.');
        }
        const pegawaiId = user.sub;
        const cadisdikId = user.cadisdik_id;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is missing from token.');
        }
        const data = await this.mandalaService.getSekolahBinaan(pegawaiId, cadisdikId);
        return {
            status: 'success',
            data,
        };
    }
    async getJadwalMonitoring(req, startDate, endDate, sekolahId, pegawaiId) {
        const user = req['user'];
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid user token.');
        }
        const cadisdikId = user.cadisdik_id;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is missing from token.');
        }
        let targetPegawaiId = pegawaiId;
        const isPengawas = Number(user.jabatan) === 6;
        if (isPengawas) {
            targetPegawaiId = user.sub;
        }
        const data = await this.mandalaService.getJadwalMonitoring(cadisdikId, {
            start_date: startDate,
            end_date: endDate,
            sekolah_id: sekolahId,
            pegawai_id: targetPegawaiId,
        });
        return {
            status: 'success',
            data,
        };
    }
    async createJadwalMonitoring(req, body) {
        const user = req['user'];
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid user token.');
        }
        const cadisdikId = user.cadisdik_id;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is missing from token.');
        }
        if (!body.sekolah_id || !body.tanggal_mulai || !body.tanggal_selesai || !body.agenda) {
            throw new common_1.BadRequestException('sekolah_id, tanggal_mulai, tanggal_selesai, and agenda are required.');
        }
        let targetPegawaiId = user.sub;
        const isPengawas = Number(user.jabatan) === 6;
        if (!isPengawas) {
            if (body.pegawai_id) {
                targetPegawaiId = body.pegawai_id;
            }
        }
        const data = await this.mandalaService.createJadwalMonitoring(cadisdikId, targetPegawaiId, body);
        return {
            status: 'success',
            message: 'Jadwal monitoring berhasil dibuat',
            data,
        };
    }
    async updateJadwalMonitoring(req, id, body) {
        const user = req['user'];
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid user token.');
        }
        const cadisdikId = user.cadisdik_id;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is missing from token.');
        }
        await this.mandalaService.updateJadwalMonitoring(id, cadisdikId, user, body);
        return {
            status: 'success',
            message: 'Jadwal monitoring berhasil diperbarui',
        };
    }
    async deleteJadwalMonitoring(req, id) {
        const user = req['user'];
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Invalid user token.');
        }
        const cadisdikId = user.cadisdik_id;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is missing from token.');
        }
        await this.mandalaService.deleteJadwalMonitoring(id, cadisdikId, user);
        return {
            status: 'success',
            message: 'Jadwal monitoring berhasil dihapus',
        };
    }
};
exports.MandalaController = MandalaController;
__decorate([
    (0, common_1.Get)('connection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getConnection", null);
__decorate([
    (0, common_1.Post)('connection'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateConnection", null);
__decorate([
    (0, common_1.Get)('sekolah'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSchools", null);
__decorate([
    (0, common_1.Get)('wilayah/provinsi'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getProvinsiList", null);
__decorate([
    (0, common_1.Get)('wilayah/kabupaten'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('provinsi')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getKabupatenList", null);
__decorate([
    (0, common_1.Get)('cadisdik'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getCadisdiks", null);
__decorate([
    (0, common_1.Get)('cadisdik/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getCadisdikDetail", null);
__decorate([
    (0, common_1.Post)('cadisdik'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createCadisdik", null);
__decorate([
    (0, common_1.Patch)('cadisdik/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateCadisdik", null);
__decorate([
    (0, common_1.Delete)('cadisdik/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "deleteCadisdik", null);
__decorate([
    (0, common_1.Get)('kategori-keperluan'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('cadisdik_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getKategoriKeperluan", null);
__decorate([
    (0, common_1.Post)('kategori-keperluan'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createKategoriKeperluan", null);
__decorate([
    (0, common_1.Patch)('kategori-keperluan/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateKategoriKeperluan", null);
__decorate([
    (0, common_1.Delete)('kategori-keperluan/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "deleteKategoriKeperluan", null);
__decorate([
    (0, common_1.Get)('antrian'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('cadisdik_id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('start_date')),
    __param(3, (0, common_1.Query)('end_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getAntrian", null);
__decorate([
    (0, common_1.Post)('antrian'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createAntrian", null);
__decorate([
    (0, common_1.Patch)('antrian/:id/status'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateAntrianStatus", null);
__decorate([
    (0, common_1.Get)('antrian/rekap'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('cadisdik_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getAntrianRekap", null);
__decorate([
    (0, common_1.Get)('jenis-jabatan'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getJenisJabatans", null);
__decorate([
    (0, common_1.Get)('jenis-jabatan/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getJenisJabatanDetail", null);
__decorate([
    (0, common_1.Post)('jenis-jabatan'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createJenisJabatan", null);
__decorate([
    (0, common_1.Patch)('jenis-jabatan/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateJenisJabatan", null);
__decorate([
    (0, common_1.Delete)('jenis-jabatan/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "deleteJenisJabatan", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "loginPegawai", null);
__decorate([
    (0, common_1.Post)('auth/verify-2fa'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "verify2FA", null);
__decorate([
    (0, common_1.Post)('auth/refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('pegawai'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('cadisdik_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getPegawais", null);
__decorate([
    (0, common_1.Get)('pegawai/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getPegawaiDetail", null);
__decorate([
    (0, common_1.Post)('pegawai'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createPegawai", null);
__decorate([
    (0, common_1.Patch)('pegawai/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updatePegawai", null);
__decorate([
    (0, common_1.Delete)('pegawai/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "deletePegawai", null);
__decorate([
    (0, common_1.Post)('pegawai/:id/reset-2fa'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "reset2FAPegawai", null);
__decorate([
    (0, common_1.Get)('mapping-pengawas'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('pegawai_id')),
    __param(1, (0, common_1.Query)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getMappingPengawas", null);
__decorate([
    (0, common_1.Post)('mapping-pengawas'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createMappingPengawas", null);
__decorate([
    (0, common_1.Delete)('mapping-pengawas/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "deleteMappingPengawas", null);
__decorate([
    (0, common_1.Get)('sekolah/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSchoolDetail", null);
__decorate([
    (0, common_1.Get)('sekolah/:id/summary'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSchoolSummary", null);
__decorate([
    (0, common_1.Get)('dapodik/peserta-didik'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getPesertaDidik", null);
__decorate([
    (0, common_1.Get)('dapodik/gtk'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('type')),
    __param(6, (0, common_1.Query)('tab')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getGtk", null);
__decorate([
    (0, common_1.Get)('presensi/peserta-didik'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('tanggal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getPesertaDidikPresence", null);
__decorate([
    (0, common_1.Get)('presensi/gtk'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('tanggal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getGtkPresence", null);
__decorate([
    (0, common_1.Get)('presensi/peserta-didik/summary'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('tahun')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getPesertaDidikPresenceSummary", null);
__decorate([
    (0, common_1.Get)('presensi/gtk/summary'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('tahun')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getGtkPresenceSummary", null);
__decorate([
    (0, common_1.Get)('dapodik/semester_id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSemesterIds", null);
__decorate([
    (0, common_1.Get)('menu-roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getMenuRoles", null);
__decorate([
    (0, common_1.Post)('menu-roles'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateMenuRoles", null);
__decorate([
    (0, common_1.Get)('pengawas/sekolah-binaan'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSekolahBinaan", null);
__decorate([
    (0, common_1.Get)('monitoring/jadwal'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('start_date')),
    __param(2, (0, common_1.Query)('end_date')),
    __param(3, (0, common_1.Query)('sekolah_id')),
    __param(4, (0, common_1.Query)('pegawai_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getJadwalMonitoring", null);
__decorate([
    (0, common_1.Post)('monitoring/jadwal'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "createJadwalMonitoring", null);
__decorate([
    (0, common_1.Patch)('monitoring/jadwal/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateJadwalMonitoring", null);
__decorate([
    (0, common_1.Delete)('monitoring/jadwal/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "deleteJadwalMonitoring", null);
exports.MandalaController = MandalaController = __decorate([
    (0, common_1.Controller)('mandala'),
    __metadata("design:paramtypes", [mandala_service_1.MandalaService])
], MandalaController);
//# sourceMappingURL=mandala.controller.js.map