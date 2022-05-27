using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebRTCVideoCallAssistant.Server.Models
{
    public partial class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Customer> Customers { get; set; } = null!;
        public virtual DbSet<Meeting> Meetings { get; set; } = null!;
        public virtual DbSet<Stat> Stats { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=default");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("Customer");

                entity.HasIndex(e => e.Phone, "UQ__Customer__5C7E359EB15AAB24")
                    .IsUnique();

                entity.HasIndex(e => e.Email, "UQ__Customer__A9D10534339366D0")
                    .IsUnique();

                entity.Property(e => e.Email).HasMaxLength(64);

                entity.Property(e => e.FirstName).HasMaxLength(64);

                entity.Property(e => e.LastName).HasMaxLength(64);

                entity.Property(e => e.Phone)
                    .HasMaxLength(13)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            modelBuilder.Entity<Meeting>(entity =>
            {
                entity.ToTable("Meeting");

                entity.HasIndex(e => e.UserConnId, "UQ__Meeting__65106B518A32C0A4")
                    .IsUnique();

                entity.HasIndex(e => e.CustomerSlug, "UQ__Meeting__80B10B703EC23716")
                    .IsUnique();

                entity.HasIndex(e => e.CustomerConnId, "UQ__Meeting__8C291389006032BC")
                    .IsUnique();

                entity.HasIndex(e => e.UserSlug, "UQ__Meeting__FB26D644CD82A243")
                    .IsUnique();

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.CustomerConnId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CustomerSlug)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.StartsAt).HasColumnType("datetime");

                entity.Property(e => e.UserConnId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.UserSlug)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Meeting__Created__6383C8BA");

                entity.HasOne(d => d.CreatedForNavigation)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.CreatedFor)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Meeting__Created__6477ECF3");

                entity.HasOne(d => d.Stat)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.StatId)
                    .HasConstraintName("FK__Meeting__StatId__03F0984C");
            });

            modelBuilder.Entity<Stat>(entity =>
            {
                entity.ToTable("Stat");

                entity.Property(e => e.EndedAt).HasColumnType("datetime");

                entity.Property(e => e.StartedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasIndex(e => e.Phone, "UQ__User__5C7E359ED77FC445")
                    .IsUnique();

                entity.HasIndex(e => e.Email, "UQ__User__A9D10534B0F78423")
                    .IsUnique();

                entity.Property(e => e.Email).HasMaxLength(64);

                entity.Property(e => e.FirstName).HasMaxLength(64);

                entity.Property(e => e.LastName).HasMaxLength(64);

                entity.Property(e => e.Password).HasMaxLength(64);

                entity.Property(e => e.Phone)
                    .HasMaxLength(13)
                    .IsUnicode(false)
                    .IsFixedLength();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
