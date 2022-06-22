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

        public virtual DbSet<Admin> Admins { get; set; } = null!;
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
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.ToTable("Admin");

                entity.HasIndex(e => e.Username, "UQ__Admin__536C85E4F4A2EC54")
                    .IsUnique();

                entity.Property(e => e.Password).HasMaxLength(64);

                entity.Property(e => e.Username).HasMaxLength(64);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("Customer");

                entity.HasIndex(e => e.Phone, "UQ__Customer__5C7E359EDF5B5BE0")
                    .IsUnique();

                entity.HasIndex(e => e.Email, "UQ__Customer__A9D105349585F613")
                    .IsUnique();

                entity.Property(e => e.Email).HasMaxLength(64);

                entity.Property(e => e.FirstName).HasMaxLength(64);

                entity.Property(e => e.LastName).HasMaxLength(64);

                entity.Property(e => e.Phone).HasMaxLength(15);
            });

            modelBuilder.Entity<Meeting>(entity =>
            {
                entity.ToTable("Meeting");

                entity.HasIndex(e => e.UserConnId, "UQ__tmp_ms_x__65106B51342540E1")
                    .IsUnique();

                entity.HasIndex(e => e.CustomerConnId, "UQ__tmp_ms_x__8C291389EE1844AF")
                    .IsUnique();

                entity.HasIndex(e => e.Slug, "UQ__tmp_ms_x__BC7B5FB6C583913C")
                    .IsUnique();

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.CustomerConnId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Slug)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.StartsAt).HasColumnType("datetime");

                entity.Property(e => e.UserConnId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.CreatedById)
                    .HasConstraintName("FK__Meeting__Created__6166761E");

                entity.HasOne(d => d.CreatedFor)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.CreatedForId)
                    .HasConstraintName("FK__Meeting__Created__607251E5");

                entity.HasOne(d => d.Stat)
                    .WithMany(p => p.Meetings)
                    .HasForeignKey(d => d.StatId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Meeting__StatId__5AB9788F");
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

                entity.HasIndex(e => e.Phone, "UQ__User__5C7E359ED82858B0")
                    .IsUnique();

                entity.HasIndex(e => e.Email, "UQ__User__A9D10534374A5ED2")
                    .IsUnique();

                entity.Property(e => e.Email).HasMaxLength(64);

                entity.Property(e => e.FirstName).HasMaxLength(64);

                entity.Property(e => e.LastName).HasMaxLength(64);

                entity.Property(e => e.Password).HasMaxLength(64);

                entity.Property(e => e.Phone).HasMaxLength(15);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
