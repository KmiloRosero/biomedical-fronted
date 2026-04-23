export type AdminProfile = {
  fullName: string;
  email: string;
  phone: string;
};

export class AdminProfileService {
  private readonly storageKey = "biowaste.adminProfile";

  public get(): AdminProfile | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AdminProfile;
    } catch {
      return null;
    }
  }

  public save(profile: AdminProfile): void {
    localStorage.setItem(this.storageKey, JSON.stringify(profile));
  }
}
